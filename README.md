# naspics
Browse photos on your NAS from any device on your network

## Motivation
I save gigabytes of photos on my ARM Linux based NAS (NetGear ReadyNAS) but there's
typically no easy way to view or browse them. The default HTTP interface is neither 
mobile friendly, nor browsing friendly. All the different "apps" for browsing 
photos in the ReadyNAS marketplace are database based, complex to install, configure
& use and importantly, don't just let you simply browse what's on your NAS

NasPics is a small server that runs on your NAS and exposes a pictures folder
through a browsable mobile friendly web interface. It lets you relive your 
memories easily at home :-)

## Building NasPics
NasPics consists of two folders a client & a server. The client needs to be first
built separately an then integrated with the server in the server build step. To
begin, first clone the repo
'''
git clone https://github.com/srinathh/naspics.git
```

### Building the Client
The client is the web interface exposed by the server. It is build on React using the 
Create React App tool, written in Javascript and requries a NodeJS development environment.
1. Ensure you have NodeJS environment and Yarn setup
2. Change to the client directory `cd naspics_clients`
3. `yarn install`
4. `yarn build`

### Building the Server
The server is written in Go, uses [Go Modules](https://golang.org/doc/go1.11#modules)
for dependency management and [Packr V2](https://github.com/gobuffalo/packr/tree/master/v2)
for embedding the client files into the server binary and finally building a single
static binary that can simply be copied over to the NAS.  

Since practically all development laptops are Intel based and most NAS are ARM based, 
you typically would want to install Go from source for easy cross-compilation

1. Install Go 1.11 or newer. If you will cross compile, [install from source](https://golang.org/doc/install/source)
2. Install [Packr Version 2](https://github.com/gobuffalo/packr/tree/master/v2)
3. Set `GO111MODULE=on` in your envionment. This is required for [Packr to work](https://github.com/gobuffalo/packr/issues/113)
4. Change to server directory `cd naspics_server`
4. Build the binary `packr2 build`. This will build the binary using `go build` and embed the client files into it
5. Test locally
6. Cross-compile if required. Eg. `GOOS=linux GOARCH=arm packr2 build -o naspics_server_arm`

## Running the Server
Simply copy over the binary generated in step 4 or 6 wherever appropriate & run the program.

### Command Line Options
- *pics*: By default, the server attempts to serve '/data/Pictures' folder (the default location 
  for Pictures in ReadyNAS). If you don't have this folder on your machine, the program will throw
  an error and exit. Simply pass the correct location via `-pics /path/to/Pictures` command line flag
- *http*: By default, the server attempts to bind to all network interfaces on port 9000. If you wnat
  to change this, set the right port via this option. eg. `-http localhost:9000`
folder is elsewhere, pass the -

## Installing as a Service
A sample systemd service file is provided in the top level folder of the repository. You can adapt
this for running your app as a service that automatically restarts when the NAS boots up. 
A great How To in [this blog](https://medium.com/@benmorel/creating-a-linux-service-with-systemd-611b5c8b91d6)
