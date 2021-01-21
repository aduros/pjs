# NAME

pjs - pipe to JavaScript

# SYNOPSIS

**pjs** [*options*] [\--] *script*...

# DESCRIPTION

**pjs** is a tool for processing text, CSV, and JSON.

pjs lets you write small and powerful JavaScript programs, similar to awk/sed/grep. It works by
generating a complete JS program from the provided script(s), and feeding it each line of standard
input. See the EXAMPLES section below to see what pjs can do.

The latest version of `pjs` can be installed by running:

```sh
npm install -g pjs-tool
```

pjs is not meant to replace awk/sed/grep, but aims to be useful to seasoned JS developers who may
not yet have mastered all the intricacies of GNU coreutils.

# OPTIONS

`-x, --explain`
: Print the generated JS program instead of running it. This is useful for debugging or simply
understanding what pjs is doing. The outputted program can be run directly in NodeJS.

`-b, --before <script>`
: Run a script before the input data is read. This can be used to initialize variables, or do
anything else that should be done on startup. Can be specified multiple times.

`-a, --after <script>`
: Run a script after all the input data is read. This can be used to aggregate a summary, or
perform anything else that should be done on completion. Can be specified multiple times.

`-d, --delimiter <delimiter>`
: The delimiter for text parsing. This is a regular expression passed to `String.prototype.split()`
used to split each line of input data into fields. The fields can be accessed by the `$` array
variable. Defaults to `\w+`.

`--csv`
: Parse the input data as CSV (comma separated values). This correctly parses quoting and escaping
in the input. When using this option, the `_` built-in variable is unavailable.

`--csv-header`
: Like `--csv`, but the first row is considered a column header. When using this option, the `$`
built-in variable is unavailable, and the `_` built-in variable is a mapping of column names to the
row's values.

`--json <filter>`
: Parse the input data as JSON (JavaScript object notation). When using this option, the `_`
built-in variable contains a JSON object. The filter defines which objects will be iterated over.
The filter is a list of JSON fields, separated by a period, and can contain wildcard characters. For
example: `--json 'rows.*'`. The full filter format is specified by
[JSONStream](https://www.npmjs.com/package/JSONStream).

`-V, --version`
: Print the version number.

`-h, --help`
: Print command-line options. The output of this option is less detailed than this document.

# JAVASCRIPT REFERENCE

## Built-in Variables

`_` (underscore)
: The current line or object being processed. With `--json` or `--csv-header`, this is an object,
otherwise it is a string.

`$` (dollar)
: An array containing the fields of the current line. The field delimiter can be set with
`--delimiter`.  As a convenience, any references to `$N` where N is a number are translated to
`$[N]`.

`COUNT`
: A numeric counter that is incremented with each line.

`LINES`
: An array containing all the lines that were processed.

`print()`
: Prints a value to standard output. Objects are converted to JSON.

## Last Expression Handling

If the last statement in the script is an expression, it will be used to filter or transform the
output. If the last expression is `true`, the line is printed unmodified. If the last expression is
a value, that value is printed instead. If the last expression is false or null, nothing is output.

Sometimes output is never desired. In those cases either make sure the last expression is false or
null (by appending a literal "`;null`"), or an empty statement (by appending a literal "`;;`").

## Implicit Imports

Using any built-in NodeJS module (eg: `fs`) will automatically import it with `require()`.

## Implicit Variable Initialization

Assigning to an undeclared variable will automatically insert a variable declaration. The initial
value of these implicit variables is always 0. For other values or types, declare them explicitly in
`--before`.

# EXAMPLES

**Remember**: You can run any of these examples with `--explain` to inspect the generated program.

## Transforming Examples

Convert a file to upper-case:

```sh
cat document.txt | pjs '_.toUpperCase()'
```

Remove trailing whitespace from each line in a file:

```sh
cat document.txt | pjs '_.replace(/\s*$/, "")'
```

Print the second field of each line (in this example, the PIDs):

```sh
ps aux | pjs '$1'
```

Print all fields after the 10th (in this example, the process names):

```sh
ps aux | pjs '$.slice(10).join(" ")'
```

## Filtering Examples

Given a list of numbers, print only numbers greater than 5:

```sh
seq 1 10 | pjs '_ > 5'
```

Given a list of numbers, print only even numbers:

```sh
seq 1 10 | pjs '_ % 2 == 0'
```

Given a list of filenames, print the files that actually exist:

```sh
cat filenames.txt | pjs 'fs.existsSync(_)'
```

Given a list of filenames, print the files that are under one kilobyte in size:

```sh
cat filenames.txt | pjs 'fs.statSync(_).size < 1000'
```

Print the last 10 lines of a file (like `tail`):

```sh
cat document.txt | pjs --after 'LINES.slice(-10).join("\n")'
```

## Summarizing Examples

Manually count the lines in the input (like `wc -l`):

```sh
cat filenames.txt | pjs 'count++ ;;' --after 'count'
```

Same as above, but using the built-in `COUNT` variable:

```sh
cat filenames.txt | pjs --after 'COUNT'
```

Count the *unique* lines in the input:

```sh
cat filenames.txt | pjs --before 'let s = new Set()' 's.add(_) ;;' --after 's.size'
```

Manually sort the lines of the input (like `sort`)

```sh
cat filenames.txt | pjs --before 'let lines = []' 'lines.push(_) ;;' \
    --after 'lines.sort().join("\n")'
```

Same as above, but using the built-in `LINES` variable:

```sh
cat filenames.txt | pjs --after 'LINES.sort().join("\n")'
```

## Advanced Examples

Bulk rename \*.jpeg files to \*.jpg:

```sh
find -name '*.jpeg' | pjs 'let f = path.parse(_);
    fs.renameSync(_, path.join(f.dir, f.name+".jpg"))'
```

Print the longest line in the input:

```sh
cat document.txt | pjs 'if (_.length > m) { m = _.length; longest = _ }' --after 'longest'
```

Count the words in the input:

```sh
cat document.txt | pjs 'words += $.length ;;' --after 'words'
```

Count the *unique* words in the input:

```sh
cat document.txt | pjs --before 'let words = new Set()' \
    'for (let word of $) words.add(word)' --after 'words.size'
```

## CSV Examples

Given a `grades.csv` file that looks like this:

```csv
name,subject,grade
Bob,physics,43
Alice,biology,75
Alice,physics,90
David,biology,85
Clara,physics,78
```

Print only the third column:

```sh
cat grades.csv | pjs --csv '$2'
```

Print the grades using the column header:

```sh
cat grades.csv | pjs --csv-header '_.grade'
```

Print the names of students taking biology:

```sh
cat grades.csv | pjs --csv-header '_.subject == "biology" && _.name'
```

Print the average grade across all courses:

```sh
cat grades.csv | pjs --csv-header 'sum += Number(_.grade) ;;' --after 'sum/COUNT'
```

## JSON Examples

Given a `users.json` file that looks like this:

```json
{
  "version": 123,
  "items": [
    {"name": {"first": "Winifred", "last": "Frost"}, "age": 42},
    {"name": {"first": "Miles", "last": "Fernandez"}, "age": 15},
    {"name": {"first": "Kennard", "last": "Floyd"}, "age": 20},
    {"name": {"first": "Lonnie", "last": "Davis"}, "age": 78},
    {"name": {"first": "Duncan", "last": "Poole"}, "age": 36}
  ]
}
```

Print the value of the "version" field:

```sh
cat users.json | pjs --json 'version' _
```

Print the full name of each user:

```sh
cat users.json | pjs --json 'items.*.name' '_.first+" "+_.last'
```

Print the users that are older than 21:

```sh
cat users.json | pjs --json 'items.*' '_.age >= 21'
```

# BUGS

Please report bugs on GitHub: https://github.com/aduros/pjs/issues

# SEE ALSO

Website: https://github.com/aduros/pjs

Related projects: [pyp](https://github.com/hauntsaninja/pyp), [nip](https://github.com/kolodny/nip),
awk. Pyp and its `--explain` was a major inspiration for this project.
