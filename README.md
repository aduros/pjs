# pjs

**pjs** is a command-line tool for filtering and transforming text, similar to `awk`. You provide it
powerful one-line snippets written in vanilla JavaScript. It supports many input formats, including
plain text, CSV, JSON, HTML, and XML.

pjs works by generating a complete JS program from the provided script, and feeding it each line of
standard input. The statically generated program can be reviewed with `--explain`.

See the [examples](#examples) section below to see what pjs can do. For complete documentation, read
the [manual](doc/manual.md) or run `man pjs`.

# Installing

Install the `pjs` command with `npm`:

```sh
npm install -g pjs-tool
```

If `npm` is not available on your environment, you can download a [standalone
executable](https://aduros.com/pjs/pjs-latest.tar.bz2). You will still need `node` installed.

# Examples

Click on an example to run it in your browser at the [pjs playground](https://aduros.com/pjs).

## Transforming Examples

Convert a file to upper-case:

[`cat input.txt | pjs '_.toUpperCase()'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20'_.toUpperCase()'%22%2C%22input%22%3A%22There%20once%20was%20a%20man%20from%20Nantucket%5CnWho%20kept%20all%20his%20cash%20in%20a%20bucket.%5CnBut%20his%20daughter%20named%20Nan%2C%5CnRan%20away%20with%20a%20man%5CnAnd%20as%20for%20the%20bucket%2C%20Nantucket.%22%7D)

Print the second field of each line (in this example, the PIDs):

[`ps aux | pjs '$1'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20'%241'%22%2C%22input%22%3A%22USER%20%20%20%20%20%20%20%20%20PID%20%25CPU%20%25MEM%20%20%20%20VSZ%20%20%20RSS%20TTY%20%20%20%20%20%20STAT%20START%20%20%20TIME%20COMMAND%5Cnsyslog%20%20%20%20%20%20%20643%20%200.0%20%200.0%20221124%20%204760%20%3F%20%20%20%20%20%20%20%20Ssl%20%20Jan28%20%20%200%3A00%20%2Fusr%2Fsbin%2Frsyslogd%20-n%20-iNONE%5Cnroot%20%20%20%20%20%20%20%20%20653%20%200.0%20%200.1%20%2018172%20%208712%20%3F%20%20%20%20%20%20%20%20Ss%20%20%20Jan28%20%20%200%3A04%20%2Flib%2Fsystemd%2Fsystemd-logind%5Cnroot%20%20%20%20%20%20%20%20%20654%20%200.2%20%200.1%20274952%20%209944%20%3F%20%20%20%20%20%20%20%20Ssl%20%20Jan28%20%20%202%3A40%20%2Fusr%2Fsbin%2Fthermald%20--systemd%20--d%5Cnroot%20%20%20%20%20%20%20%20%20655%20%200.0%20%200.1%20393916%2012676%20%3F%20%20%20%20%20%20%20%20Ssl%20%20Jan28%20%20%200%3A07%20%2Fusr%2Flibexec%2Fudisks2%2Fudisksd%5Cnroot%20%20%20%20%20%20%20%20%20657%20%200.0%20%200.1%20%2015208%20%208124%20%3F%20%20%20%20%20%20%20%20Ss%20%20%20Jan28%20%20%200%3A00%20%2Fsbin%2Fwpa_supplicant%20-u%20-s%20-O%20%2Fr%5Cnavahi%20%20%20%20%20%20%20%20666%20%200.0%20%200.0%20%20%209224%20%20%20324%20%3F%20%20%20%20%20%20%20%20S%20%20%20%20Jan28%20%20%200%3A00%20avahi-daemon%3A%20chroot%20helper%5Cnroot%20%20%20%20%20%20%20%20%20710%20%200.0%20%200.1%20306056%20%208344%20%3F%20%20%20%20%20%20%20%20SLsl%20Jan28%20%20%200%3A02%20%2Fusr%2Fsbin%2Flightdm%5Cnroot%20%20%20%20%20%20%20%20%20715%20%200.0%20%200.1%20315100%20%209992%20%3F%20%20%20%20%20%20%20%20Ssl%20%20Jan28%20%20%200%3A00%20%2Fusr%2Fsbin%2FModemManager%22%7D)

Print all fields after the 10th (in this example, the process names):

[`ps aux | pjs '$.slice(10).join(" ")'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20'%24.slice(10).join(%5C%22%20%5C%22)'%22%2C%22input%22%3A%22USER%20%20%20%20%20%20%20%20%20PID%20%25CPU%20%25MEM%20%20%20%20VSZ%20%20%20RSS%20TTY%20%20%20%20%20%20STAT%20START%20%20%20TIME%20COMMAND%5Cnsyslog%20%20%20%20%20%20%20643%20%200.0%20%200.0%20221124%20%204760%20%3F%20%20%20%20%20%20%20%20Ssl%20%20Jan28%20%20%200%3A00%20%2Fusr%2Fsbin%2Frsyslogd%20-n%20-iNONE%5Cnroot%20%20%20%20%20%20%20%20%20653%20%200.0%20%200.1%20%2018172%20%208712%20%3F%20%20%20%20%20%20%20%20Ss%20%20%20Jan28%20%20%200%3A04%20%2Flib%2Fsystemd%2Fsystemd-logind%5Cnroot%20%20%20%20%20%20%20%20%20654%20%200.2%20%200.1%20274952%20%209944%20%3F%20%20%20%20%20%20%20%20Ssl%20%20Jan28%20%20%202%3A40%20%2Fusr%2Fsbin%2Fthermald%20--systemd%20--d%5Cnroot%20%20%20%20%20%20%20%20%20655%20%200.0%20%200.1%20393916%2012676%20%3F%20%20%20%20%20%20%20%20Ssl%20%20Jan28%20%20%200%3A07%20%2Fusr%2Flibexec%2Fudisks2%2Fudisksd%5Cnroot%20%20%20%20%20%20%20%20%20657%20%200.0%20%200.1%20%2015208%20%208124%20%3F%20%20%20%20%20%20%20%20Ss%20%20%20Jan28%20%20%200%3A00%20%2Fsbin%2Fwpa_supplicant%20-u%20-s%20-O%20%2Fr%5Cnavahi%20%20%20%20%20%20%20%20666%20%200.0%20%200.0%20%20%209224%20%20%20324%20%3F%20%20%20%20%20%20%20%20S%20%20%20%20Jan28%20%20%200%3A00%20avahi-daemon%3A%20chroot%20helper%5Cnroot%20%20%20%20%20%20%20%20%20710%20%200.0%20%200.1%20306056%20%208344%20%3F%20%20%20%20%20%20%20%20SLsl%20Jan28%20%20%200%3A02%20%2Fusr%2Fsbin%2Flightdm%5Cnroot%20%20%20%20%20%20%20%20%20715%20%200.0%20%200.1%20315100%20%209992%20%3F%20%20%20%20%20%20%20%20Ssl%20%20Jan28%20%20%200%3A00%20%2Fusr%2Fsbin%2FModemManager%22%7D)

Remove trailing whitespace from each line in a file:

`cat document.txt | pjs '_.replace(/\s*$/, "")'`

## Filtering Examples

Given a list of numbers, print only numbers greater than 5:

[`seq 1 10 | pjs '_ > 5'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20'_%20%3E%205'%22%2C%22input%22%3A%221%5Cn2%5Cn3%5Cn4%5Cn5%5Cn6%5Cn7%5Cn8%5Cn9%5Cn10%22%7D)

Given a list of numbers, print only even numbers:

[`seq 1 10 | pjs '_ % 2 == 0'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20'_%20%25%202%20%3D%3D%200'%22%2C%22input%22%3A%221%5Cn2%5Cn3%5Cn4%5Cn5%5Cn6%5Cn7%5Cn8%5Cn9%5Cn10%22%7D)

Print the last 4 lines of a file (like `tail`):

[`seq 1 10 | pjs --after 'LINES.slice(-4).join("\n")'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--after%20'LINES.slice(-4).join(%5C%22%5C%5Cn%5C%22)'%22%2C%22input%22%3A%221%5Cn2%5Cn3%5Cn4%5Cn5%5Cn6%5Cn7%5Cn8%5Cn9%5Cn10%22%7D)

Print every other line of a file:

[`cat input.txt | pjs 'COUNT % 2 == 1'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20'COUNT%20%25%202%20%3D%3D%201'%22%2C%22input%22%3A%22There%20once%20was%20a%20man%20from%20Nantucket%5CnWho%20kept%20all%20his%20cash%20in%20a%20bucket.%5CnBut%20his%20daughter%20named%20Nan%2C%5CnRan%20away%20with%20a%20man%5CnAnd%20as%20for%20the%20bucket%2C%20Nantucket.%22%7D)

Given a list of filenames, print the files that actually exist:

`cat filenames.txt | pjs 'fs.existsSync(_)'`

Given a list of filenames, print the files that are under one kilobyte in size:

`cat filenames.txt | pjs 'fs.statSync(_).size < 1000'`

## Summarizing Examples

Manually count the lines in the input (like `wc -l`):

[`cat input.txt | pjs '{ count++ }' --after 'count'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20'%7B%20count%2B%2B%20%7D'%20--after%20'count'%22%2C%22input%22%3A%22There%20once%20was%20a%20man%20from%20Nantucket%5CnWho%20kept%20all%20his%20cash%20in%20a%20bucket.%5CnBut%20his%20daughter%20named%20Nan%2C%5CnRan%20away%20with%20a%20man%5CnAnd%20as%20for%20the%20bucket%2C%20Nantucket.%22%7D)

Same as above, but using the built-in `COUNT` variable:

[`cat input.txt | pjs --after 'COUNT'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--after%20'COUNT'%22%2C%22input%22%3A%22There%20once%20was%20a%20man%20from%20Nantucket%5CnWho%20kept%20all%20his%20cash%20in%20a%20bucket.%5CnBut%20his%20daughter%20named%20Nan%2C%5CnRan%20away%20with%20a%20man%5CnAnd%20as%20for%20the%20bucket%2C%20Nantucket.%22%7D)

Count the *unique* lines in the input:

[`cat input.txt | pjs --before 'let s = new Set()' '{ s.add(_) }' --after 's.size'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--before%20'let%20s%20%3D%20new%20Set()'%20'%7B%20s.add(_)%20%7D'%20--after%20's.size'%22%2C%22input%22%3A%22Laid%20back%2C%5CnLaid%20back%2C%5CnLaid%20back%20we'll%20give%20you%20play%20back.%5CnLaid%20back%2C%5CnLaid%20back%2C%5CnLaid%20back%20I'll%20give%20you%20play%20back.%22%7D)

Manually sort the lines of the input (like `sort`)

[`cat input.txt | pjs --before 'let lines = []' '{ lines.push(_) }' --after 'lines.sort().join("\n")'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--before%20'let%20lines%20%3D%20%5B%5D'%20'%7B%20lines.push(_)%20%7D'%20--after%20'lines.sort().join(%5C%22%5C%5Cn%5C%22)'%22%2C%22input%22%3A%22There%20once%20was%20a%20man%20from%20Nantucket%5CnWho%20kept%20all%20his%20cash%20in%20a%20bucket.%5CnBut%20his%20daughter%20named%20Nan%2C%5CnRan%20away%20with%20a%20man%5CnAnd%20as%20for%20the%20bucket%2C%20Nantucket.%22%7D)

Same as above, but using the built-in `LINES` variable:

[`cat input.txt | pjs --after 'LINES.sort().join("\n")'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--after%20'LINES.sort().join(%5C%22%5C%5Cn%5C%22)'%22%2C%22input%22%3A%22There%20once%20was%20a%20man%20from%20Nantucket%5CnWho%20kept%20all%20his%20cash%20in%20a%20bucket.%5CnBut%20his%20daughter%20named%20Nan%2C%5CnRan%20away%20with%20a%20man%5CnAnd%20as%20for%20the%20bucket%2C%20Nantucket.%22%7D)

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

[`cat grades.csv | pjs --csv '$2'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--csv%20'%242'%22%2C%22input%22%3A%22name%2Csubject%2Cgrade%5CnBob%2Cphysics%2C43%5CnAlice%2Cbiology%2C75%5CnAlice%2Cphysics%2C90%5CnDavid%2Cbiology%2C85%5CnClara%2Cphysics%2C78%22%7D)

Print the grades using the column header:

[`cat grades.csv | pjs --csv-header '_.grade'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--csv-header%20'_.grade'%22%2C%22input%22%3A%22name%2Csubject%2Cgrade%5CnBob%2Cphysics%2C43%5CnAlice%2Cbiology%2C75%5CnAlice%2Cphysics%2C90%5CnDavid%2Cbiology%2C85%5CnClara%2Cphysics%2C78%22%7D)

Print the names of students taking biology:

[`cat grades.csv | pjs --csv-header '_.subject == "biology" && _.name'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--csv-header%20'_.subject%20%3D%3D%20%5C%22biology%5C%22%20%26%26%20_.name'%22%2C%22input%22%3A%22name%2Csubject%2Cgrade%5CnBob%2Cphysics%2C43%5CnAlice%2Cbiology%2C75%5CnAlice%2Cphysics%2C90%5CnDavid%2Cbiology%2C85%5CnClara%2Cphysics%2C78%22%7D)

Print the average grade across all courses:

[`cat grades.csv | pjs --csv-header '{ sum += Number(_.grade) }' --after 'sum/COUNT'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--csv-header%20'%7B%20sum%20%2B%3D%20Number(_.grade)%20%7D'%20--after%20'sum%2FCOUNT'%22%2C%22input%22%3A%22name%2Csubject%2Cgrade%5CnBob%2Cphysics%2C43%5CnAlice%2Cbiology%2C75%5CnAlice%2Cphysics%2C90%5CnDavid%2Cbiology%2C85%5CnClara%2Cphysics%2C78%22%7D)

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

[`cat users.json | pjs --json '.version' _`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--json%20'.version'%20_%22%2C%22input%22%3A%22%7B%5Cn%20%20%5C%22version%5C%22%3A%20123%2C%5Cn%20%20%5C%22items%5C%22%3A%20%5B%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Winifred%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Frost%5C%22%7D%2C%20%5C%22age%5C%22%3A%2042%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Miles%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Fernandez%5C%22%7D%2C%20%5C%22age%5C%22%3A%2015%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Kennard%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Floyd%5C%22%7D%2C%20%5C%22age%5C%22%3A%2020%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Lonnie%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Davis%5C%22%7D%2C%20%5C%22age%5C%22%3A%2078%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Duncan%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Poole%5C%22%7D%2C%20%5C%22age%5C%22%3A%2036%7D%5Cn%20%20%5D%5Cn%7D%22%7D)

Print the full name of each user:

[`cat users.json | pjs --json '.items[].name' '_.first+" "+_.last'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--json%20'.items%5B%5D.name'%20'_.first%2B%5C%22%20%5C%22%2B_.last'%22%2C%22input%22%3A%22%7B%5Cn%20%20%5C%22version%5C%22%3A%20123%2C%5Cn%20%20%5C%22items%5C%22%3A%20%5B%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Winifred%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Frost%5C%22%7D%2C%20%5C%22age%5C%22%3A%2042%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Miles%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Fernandez%5C%22%7D%2C%20%5C%22age%5C%22%3A%2015%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Kennard%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Floyd%5C%22%7D%2C%20%5C%22age%5C%22%3A%2020%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Lonnie%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Davis%5C%22%7D%2C%20%5C%22age%5C%22%3A%2078%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Duncan%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Poole%5C%22%7D%2C%20%5C%22age%5C%22%3A%2036%7D%5Cn%20%20%5D%5Cn%7D%22%7D)

Print the users that are older than 21:

[`cat users.json | pjs --json '.items[]' '_.age >= 21'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--json%20'.items%5B%5D'%20'_.age%20%3E%3D%2021'%22%2C%22input%22%3A%22%7B%5Cn%20%20%5C%22version%5C%22%3A%20123%2C%5Cn%20%20%5C%22items%5C%22%3A%20%5B%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Winifred%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Frost%5C%22%7D%2C%20%5C%22age%5C%22%3A%2042%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Miles%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Fernandez%5C%22%7D%2C%20%5C%22age%5C%22%3A%2015%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Kennard%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Floyd%5C%22%7D%2C%20%5C%22age%5C%22%3A%2020%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Lonnie%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Davis%5C%22%7D%2C%20%5C%22age%5C%22%3A%2078%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Duncan%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Poole%5C%22%7D%2C%20%5C%22age%5C%22%3A%2036%7D%5Cn%20%20%5D%5Cn%7D%22%7D)

Print the ages of the first 3 users only:

[`cat users.json | pjs --json '.items[0:3]' '_.age'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--json%20'.items%5B0%3A3%5D'%20'_.age'%22%2C%22input%22%3A%22%7B%5Cn%20%20%5C%22version%5C%22%3A%20123%2C%5Cn%20%20%5C%22items%5C%22%3A%20%5B%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Winifred%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Frost%5C%22%7D%2C%20%5C%22age%5C%22%3A%2042%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Miles%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Fernandez%5C%22%7D%2C%20%5C%22age%5C%22%3A%2015%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Kennard%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Floyd%5C%22%7D%2C%20%5C%22age%5C%22%3A%2020%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Lonnie%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Davis%5C%22%7D%2C%20%5C%22age%5C%22%3A%2078%7D%2C%5Cn%20%20%20%20%7B%5C%22name%5C%22%3A%20%7B%5C%22first%5C%22%3A%20%5C%22Duncan%5C%22%2C%20%5C%22last%5C%22%3A%20%5C%22Poole%5C%22%7D%2C%20%5C%22age%5C%22%3A%2036%7D%5Cn%20%20%5D%5Cn%7D%22%7D)

Query a web API for users:

```sh
curl -A "" 'https://www.instagram.com/web/search/topsearch/?query=John' |
    pjs --json '.users[].user' '`@${_.username} (${_.full_name})`'
```

## HTML/XML Examples

Print the text of all `<h1>` and `<h2>` elements on a web page:

[`cat page.html | pjs --html 'h1,h2' '_.text'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--html%20'h1%2Ch2'%20'_.text'%22%2C%22input%22%3A%22%3Chtml%3E%5Cn%3Cbody%3E%5Cn%20%20%3Ch1%3EWelcome%20To%20My%20Geocities%20Homepage%3C%2Fh1%3E%5Cn%5Cn%20%20%3Cdiv%3E%5Cn%20%20%20%20Under%20CONSTRUCTION%5Cn%20%20%20%20%3Cimg%20src%3D%5C%22construction.gif%5C%22%3E%5Cn%20%20%3C%2Fdiv%3E%5Cn%5Cn%20%20%3Cimg%20src%3D%5C%22dancing-baby.gif%5C%22%3E%5Cn%5Cn%20%20%3Cdiv%3E%5Cn%20%20%20%20Visitor%20counter%3A%20%3Cspan%20id%3D%5C%22counter%5C%22%3E1234%3C%2Fspan%3E%5Cn%20%20%3C%2Fdiv%3E%5Cn%5Cn%20%20%3Ch1%3EGuestbook%3C%2Fh1%3E%5Cn%5Cn%20%20Sign%20my%20%3Ca%20href%3D%5C%22guestbook.html%5C%22%3EGuestbook!%3C%2Fa%3E%5Cn%3C%2Fbody%3E%5Cn%3C%2Fhtml%3E%22%7D)

Print the URLs of all images on a web page:

[`cat page.html | pjs --html 'img' '_.attr.src'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--html%20'img'%20'_.attr.src'%22%2C%22input%22%3A%22%3Chtml%3E%5Cn%3Cbody%3E%5Cn%20%20%3Ch1%3EWelcome%20To%20My%20Geocities%20Homepage%3C%2Fh1%3E%5Cn%5Cn%20%20%3Cdiv%3E%5Cn%20%20%20%20Under%20CONSTRUCTION%5Cn%20%20%20%20%3Cimg%20src%3D%5C%22construction.gif%5C%22%3E%5Cn%20%20%3C%2Fdiv%3E%5Cn%5Cn%20%20%3Cimg%20src%3D%5C%22dancing-baby.gif%5C%22%3E%5Cn%5Cn%20%20%3Cdiv%3E%5Cn%20%20%20%20Visitor%20counter%3A%20%3Cspan%20id%3D%5C%22counter%5C%22%3E1234%3C%2Fspan%3E%5Cn%20%20%3C%2Fdiv%3E%5Cn%5Cn%20%20%3Ch1%3EGuestbook%3C%2Fh1%3E%5Cn%5Cn%20%20Sign%20my%20%3Ca%20href%3D%5C%22guestbook.html%5C%22%3EGuestbook!%3C%2Fa%3E%5Cn%3C%2Fbody%3E%5Cn%3C%2Fhtml%3E%22%7D)

Scrape headlines off a news site using a complex CSS selector:

```sh
curl https://news.ycombinator.com | pjs '_.text' \
    --html 'table table tr:nth-last-of-type(n+2) td:nth-child(3)'
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

## Advanced Examples

Bulk rename \*.jpeg files to \*.jpg:

```sh
find -name '*.jpeg' | pjs 'let f = path.parse(_);
    fs.renameSync(_, path.join(f.dir, f.name+".jpg"))'
```

Print the longest line in the input:

[`cat input.txt | pjs 'if (_.length > m) { m = _.length; longest = _ }' --after 'longest'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20'if%20(_.length%20%3E%20m)%20%7B%20m%20%3D%20_.length%3B%20longest%20%3D%20_%20%7D'%20--after%20'longest'%22%2C%22input%22%3A%22There%20once%20was%20a%20man%20from%20Nantucket%5CnWho%20kept%20all%20his%20cash%20in%20a%20bucket.%5CnBut%20his%20daughter%20named%20Nan%2C%5CnRan%20away%20with%20a%20man%5CnAnd%20as%20for%20the%20bucket%2C%20Nantucket.%22%7D)

Count the words in the input:

[`cat input.txt | pjs '{ words += $.length }' --after 'words'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20'%7B%20words%20%2B%3D%20%24.length%20%7D'%20--after%20'words'%22%2C%22input%22%3A%22There%20once%20was%20a%20man%20from%20Nantucket%5CnWho%20kept%20all%20his%20cash%20in%20a%20bucket.%5CnBut%20his%20daughter%20named%20Nan%2C%5CnRan%20away%20with%20a%20man%5CnAnd%20as%20for%20the%20bucket%2C%20Nantucket.%22%7D)

Count the *unique* words in the input:

[`cat input.txt | pjs --before 'let words = new Set()' 'for (let word of $) words.add(word)' --after 'words.size'`](https://aduros.com/pjs/#%7B%22command%22%3A%22pjs%20--before%20'let%20words%20%3D%20new%20Set()'%20'for%20(let%20word%20of%20%24)%20words.add(word)'%20--after%20'words.size'%22%2C%22input%22%3A%22There%20once%20was%20a%20man%20from%20Nantucket%5CnWho%20kept%20all%20his%20cash%20in%20a%20bucket.%5CnBut%20his%20daughter%20named%20Nan%2C%5CnRan%20away%20with%20a%20man%5CnAnd%20as%20for%20the%20bucket%2C%20Nantucket.%22%7D)

Using a script file instead of command-line arguments:

```sh
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

```sh
echo "#!/usr/bin/env -S pjs -f" | cat - my-uppercase.js > my-uppercase
chmod +x my-uppercase

./my-uppercase document.txt
```

Completely scrape an entire online store, outputting a JSON stream for later processing:

```sh
for page in `seq 1 50`; do

    >&2 echo "Scraping page $page..."
    curl -s "http://books.toscrape.com/catalogue/page-$page.html" |
        pjs --html '.product_pod h3 a' '"http://books.toscrape.com/catalogue/"+_.attr.href' |

        while read url; do
            >&2 echo "Scraping item details from $url"
            curl -s "$url" | pjs --html '.product_page' 'JSON.stringify({
                title: _.querySelector(".product_main h1").text,
                description: _.querySelector("#product_description + p").text})'
        done
done
```
