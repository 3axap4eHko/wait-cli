# Wait CLI

zero dependency commandline tool to orchestrate execution

## Installing

``` bash
$ npm install -g wait-cli
```

## Usage
``` bash
$ wait [options] <command> <...arguments>
```
### tcp
Awaiting tcp connection(s) to specified addresses

Options:
- `-s, --sequenced` - Next connection waits for complete previous connection

Example: `wait tcp google.com:443`

### cmd
Awaiting finishing command execution

Options:
- `-r, --retry` - retry on non zero exit code of command
- `-s, --sequenced` - next command waits for complete previous command

Example: `wait cmd "curl -sL https://my-domain.never/app-setup.sh | bash -" "app run" --retry --sequenced`

### sleep
Awaiting for specified seconds

Example: `wait sleep 20`

## More Await Examples
 - MongoDB - `wait tcp localhost:27017`
 - MySQL - `wait tcp localhost:3306`
 - MSSQL - `wait tcp localhost:1433`
 - HTTP -  `wait tcp localhost`
 - HTTPS -  `wait tcp localhost:443`
 - Memcache -  `wait tcp localhost:11211`
 - Downloading complete (even with errors) - `wait cmd "wget https://mydomain.com/superscript.sh"`
 - Downloading complete (retry on fail) - `wait cmd "wget https://mydomain.com/superscript.sh" --retry`
 - Script execution complete - `wait cmd "sh superscript.sh"`
 - Downloading complete and success script execution - `wait cmd "wget https://mydomain.com/superscript.sh" "sh superscript.sh" --sequenced`
 - 20 Seconds - `wait sleep 20`

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2017-present Ivan Zakharchenko