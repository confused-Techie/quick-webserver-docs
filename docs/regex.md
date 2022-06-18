# Regex

Thought it may be a good idea to leave notes to myself and any other developers looking at this, to help understand what the regex is doing.

## generate.js

### genJSON()

#### \@param

```javascript
const re = new RegExp('\\*\\s+@param\\s+\\{(?<location>[a-zA-Z]+)\\|(?<type>[a-zA-Z]+)\\}\\s+\\[(?<name>\\w+)=(?<value>\\S+)\\]\\s+-\\s+(?<desc>.*)');
```

Once `match` is used on an applicable string, it will return named groups that we are able to assign exactly.

```javascript
match.groups.location;
match.groups.type;
match.groups.name;
match.groups.value;
match.groups.desc;
```

Heres the same Regex with any JavaScript escaping and object initialization removed:

```
/\*\s+@param\s+\{(?<location>[a-zA-Z]+)\|(?<type>[a-zA-Z]+)\}\s+\[(?<name>\w+)=(?<value>\S+)\]\s+-\s+(?<desc>.*)
```

A Quick Summary of what this is doing: (Please note in the future its intended that each value is optional. Currently that is not the case.)

* `\*\s+` - Matches '*' and any whitespace character between one and unlimited times.
* `@param\s+` - Then matches '@param' exactly followed by any whitespace character between one and unlimited times.
* `\{` - Matches '{' escaped within Regex.
* `(?<location>...)` - Sets up a Named Capture Group of 'location'
* `[a-zA-Z]+` Matches within 'location' characters between the index of a-z and A-Z one to unlimited times.
* `\|` - Match '|' exactly.
* `(?<type>[a-zA-Z]+)` - Again creates a Named Capture Group of 'type' where it matches the index a-z and A-Z one to unlimited times.
* `\}\s+\[` - Matches '}' followed by any whitespace character one to unlimited times, followed by '['
* `(?<name>\w+)` - Named Capture Group Matching any word character one to unlimited times.
* `=` - Matches '=' literally.
* `(?<value>\S+)\]` - Named Capture Group Matching any Non-Whitespace character one to unlimited times, followed by ']' literally.
* `\s+-\s+` - Any Whitespace character one to unlimited times followed by '-' literally again followed by any whitespace character one to unlimited times.
* `(?<desc>.*)` - Finally a Named Capture Group matching any single character one to unlimited times.

#### \@response

```javascript
const re = new RegExp('\\*\\s+@response\\s+(?<status>\\{\\d{1,3}\\})\\s+(?<type>\\[[a-zA-Z/]+\\])\\s+-\\s+(?<desc>.*)');
```

Once `match` is used on an applicable string, it will return named groups that need some small modifications to assign.

```javascript
match.groups.status.replace("{","").replace("}","");
match.groups.type.replace("[","").replace("]","");
match.groups.desc.trim();
```

Heres the same Regex with any JavaScript escaping and object initialization removed.

```
\*\s+@response\s+(?<status>\{\d{1,3}\})\s+(?<type>\[[a-zA-Z/]+\])\s+-\s+(?<desc>.*)
```

A Quick Summary of what this is doing: (Please note in the future its intended that each value is optional. Currently that is not the case.)

* `\*\s+` - Matches '*' followed by any whitespace character one to unlimited times.
* `@response\s+` - Matches '@response' literally followed by any whitespace character one to unlimited times.
* `(?<status>\{\d{1,3}\})` - Named Capture Group 'status' matching a digit ([0-9]) between one and three times. Preceded by '{' literally and followed by '}' literally.
* `\s+(?<type>\[[a-zA-Z/]+\])` - Matches firstly any whitespace character between one and unlimited times. Followed by creating a Named Capture Group 'type' where inside it matches '[' literally, then the index a-z and A-Z AND '/' literally between one and unlimited times. Followed by ']' literally.
* `\s+-\s+` - Matches any whitespace character one to unlimited times, followed by '-' literally, then again followed by any whitespace character between one and unlimited times.
* `(?<desc>.*)` - Finally creating a Named Capture Group 'desc' matching any single character an unlimited amount of times.
