# Wait CLI

zero dependency commandline tool to orchestrate execution

## Installing

``` bash
$ npm install -g wait-cli
```

## Usage
``` bash
$ await [options] <command> <...arguments>
```
### tcp
Awaiting tcp connection(s) to specified addresses

Options:
- `-s, --sequenced` - Next connection waits for complete previous connection

Example: `await tcp google.com:443`

### cmd
Awaiting finishing command execution

Options:
- `-r, --retry` - retry on non zero exit code of command
- `-s, --sequenced` - next command waits for complete previous command

Example: `await cmd "curl -sL https://my-domain.never/app-setup.sh | bash -" "app run" --retry --sequenced`

### exists
Awaiting existing specified path

Options:
- `-s, --sequenced` - next existing check waits for complete previous existing check
- `-m, --mode` - access mode of path r-read, w-write, e-execute

Example: `await exists "/var/database.pid" "/var/application.pid" --sequenced --mode r`

### network
Awaiting for network adapter

Options:
- `-m, --mac <mac address mask>` - specify mac address mask
- `-i, --internal` - network adapter should be internal

Example: `await network vmnet --mac 00:* --internal`


### time
Awaiting for specified seconds

Example: `await time 20`

## More Await Examples
 - MongoDB - `await tcp localhost:27017`
 - MySQL - `await tcp localhost:3306`
 - MSSQL - `await tcp localhost:1433`
 - HTTP -  `await tcp localhost`
 - HTTPS -  `await tcp localhost:443`
 - Memcache -  `await tcp localhost:11211`
 - Downloading complete (even with errors) - `await cmd "wget https://mydomain.com/superscript.sh"`
 - Downloading complete (retry on fail) - `await cmd "wget https://mydomain.com/superscript.sh" --retry`
 - Script execution complete - `await cmd "sh superscript.sh"`
 - Downloading complete and success script execution - `await cmd "wget https://mydomain.com/superscript.sh" "sh superscript.sh" --sequenced`
 - 20 Seconds - `await time 20`

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2017-present Ivan Zakharchenko