# NAME

pjs - pipe using explainable JavaScript

# SYNOPSIS

**pjs** [*options*] [\--] '*script text*' [file ...]  
**pjs** [*options*] **-f** *script-file* [\--] [file ...]

# DESCRIPTION

**pjs** is a tool for processing text, CSV, JSON, HTML, and XML.

pjs lets you write small and powerful JavaScript programs, similar to awk/sed/grep. It works by
generating a complete JS program from the provided script, and feeding it each line of standard
input. The generated program can be reviewed with `--explain`. See the EXAMPLES section below to see
what pjs can do.

The latest version of `pjs` can be installed by running:

```sh
npm install -g pjs-tool
```

If `npm` is not available on your environment, you can download a standalone executable from
https://aduros.com/pjs/pjs-latest.tar.bz2 (You will still need `node` installed)

pjs is not meant to replace awk/sed/grep, but aims to be useful to seasoned JS developers who may
not yet have mastered all the intricacies of GNU coreutils, or wish to use advanced features like
HTML and JSON parsing.

# OPTIONS

`-x, --explain`
: Print the generated JS program instead of running it. This is useful for debugging or simply
understanding what pjs is doing. The outputted program can be run directly in NodeJS.

`-b, --before <script-text>`
: Run a script before the input data is read. This can be used to initialize variables, or do
anything else that should be done on startup. Can be specified multiple times.

`-a, --after <script-text>`
: Run a script after all the input data is read. This can be used to aggregate a summary, or
perform anything else that should be done on completion. Can be specified multiple times.

`-f, --file <script-file>`
: Load script text from a file instead of the command-line.

`-d, --delimiter <delimiter>`
: The delimiter for text parsing. This is a regular expression passed to `String.prototype.split()`
used to split each line of input data into fields. The fields can be accessed by the `$` array
variable. Defaults to `\w+`.

`--csv`
: Parse the input data as CSV (comma separated values). Quotes and escape sequences in the input are
correctly handled. When using this option the `_` built-in variable is unavailable.

`--csv-header`
: Like `--csv`, but the first row is considered a column header. When using this option the `$`
built-in variable is unavailable, and the `_` built-in variable is a mapping of column names to the
row's values.

`--json <filter>`
: Parse the input data as JSON (JavaScript object notation). When using this option the `_`
built-in variable contains a JSON object. The filter defines which objects will be iterated over.
The filter is a list of JSON fields, separated by a period, and can contain wildcard characters. For
example: `--json 'rows.*'`. The full filter format is specified by
[JSONStream](https://www.npmjs.com/package/JSONStream).

`--html <selector>`
: Parse the input data as HTML, iterating over elements that match the given CSS selector. The
parser is forgiving with malformed HTML. The `_` built-in variable will contain an object with the
keys: `type`, `name`, `attr`, `children`, `text`, and `innerHTML`. It also contains methods
`querySelector()` and `querySelectorAll()` for further querying using another CSS selector.

`--xml <selector>`
: Same as `--html`, but tags and attributes are considered case-sensitive.

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

`FILENAME`
: The name of the current input file, or null if reading from stdin.

`print()`
: Prints a value to standard output. Objects are converted to JSON.

## Last Expression Handling

If the last statement in the script is an expression, it will be used to filter or transform the
output. If the last expression is `true`, the line is printed unmodified. If the last expression is
a value, that value is printed instead. If the last expression is false or null, nothing is output.

Sometimes output is never desired. In those cases either make sure the last expression is false or
null, or wrap the expression in curly braces to make it a block statement.

## Implicit Imports

Using any built-in NodeJS module (eg: `fs`) will automatically import it with `require()`.

## Implicit Variable Initialization

Assigning to an undeclared variable will automatically insert a variable declaration. The initial
value of these implicit variables is always 0. For other values or types, declare them explicitly in
`--before`.

## Before/After Labels

The JavaScript loop labels `BEFORE:` and `AFTER:` can be used to mark expressions that will be run
as if they were passed separately to `--before` or `--after`. This can be useful in combination with
`--file` to keep everything in one script file, or if you just prefer awk-like syntax.

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

Print every other line of a file:

```sh
cat document.txt | pjs 'COUNT % 2 == 1'
```

## Summarizing Examples

Manually count the lines in the input (like `wc -l`):

```sh
cat filenames.txt | pjs '{ count++ }' --after 'count'
```

Same as above, but using the built-in `COUNT` variable:

```sh
cat filenames.txt | pjs --after 'COUNT'
```

Count the *unique* lines in the input:

```sh
cat filenames.txt | pjs --before 'let s = new Set()' '{ s.add(_) }' --after 's.size'
```

Manually sort the lines of the input (like `sort`)

```sh
cat filenames.txt | pjs --before 'let lines = []' '{ lines.push(_) }' \
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
cat document.txt | pjs '{ words += $.length }' --after 'words'
```

Count the *unique* words in the input:

```sh
cat document.txt | pjs --before 'let words = new Set()' \
    'for (let word of $) words.add(word)' --after 'words.size'
```

Using a script file instead of command-line arguments:

```
echo '
    BEFORE: {
        print("Starting up!")
    }
    _.toUpperCase()
    AFTER: "Total lines: "+COUNT
' > my-uppercase.js

cat document.txt | pjs -f my-uppercase.js
```

Adding a shebang to the above script to make it self-executable:

```
echo "#!/usr/bin/env -S pjs -f" | cat - my-uppercase.js > my-uppercase
chmod +x my-uppercase

./my-uppercase document.txt
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
cat grades.csv | pjs --csv-header '{ sum += Number(_.grade) }' --after 'sum/COUNT'
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

## HTML/XML Examples

Print the text of all `<h1>` and `<h2>` elements on a web page:

```sh
curl https://aduros.com | pjs --html 'h1,h2' '_.text'
```

Print the URLs of all images on a web page:

```sh
curl https://aduros.com | pjs --html 'img' '_.attr.src'
```

Scrape headlines off a news site using a complex CSS selector:

```sh
curl https://news.ycombinator.com | pjs '_.text' \
    --html 'table table tr:nth-last-of-type(n+2) td:nth-child(3)'
```

Print a count of all external links:

```sh
curl https://aduros.com | pjs --html 'a[target=_blank]' --after COUNT
```

Print all links in `<h2>` elements with URLs containing the word "blog":

```sh
curl https://aduros.com | pjs --html 'h2 a' '_.attr.href.includes("blog") && _.attr.href'
```

Print a readable summary of an RSS feed:

```sh
curl https://aduros.com/index.xml | pjs --xml 'item' \
    '_.querySelector("title").text + " --> " + _.querySelector("link").text'
```

# BUGS

Please report bugs on GitHub: https://github.com/aduros/pjs/issues

# SEE ALSO

Website: https://github.com/aduros/pjs

Related projects: [pyp](https://github.com/hauntsaninja/pyp), [nip](https://github.com/kolodny/nip),
awk. Pyp and its `--explain` was a major inspiration for this project.
