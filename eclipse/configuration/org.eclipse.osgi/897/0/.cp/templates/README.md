

# Nodeclipse CLI & Installer

[![NPM version](https://badge.fury.io/js/nodeclipse.png)](http://badge.fury.io/js/nodeclipse)

## Node.js Development with Eclipse or Enide Studio

Install with `npm install -g nodeclipse`

Usage: just run `nodeclipse -p` to add needed `.project` file to current directory

In Eclipse `File -> Import -> General / Existing Projects into Workspace`

Check <http://www.nodeclipse.org/> on how to get Nodeclipse or Enide Studio

## Nodeclipse CLI Commands

`nodeclipse -h`

	Usage: nodeclipse [arguments]

	Arguments:
	  -c, --create <name>      create project folder <name> [using template] and prepare it
	  -u, --use <template>     use/copy specified template when creating project
	  -p, --prepare            prepare Nodeclipse [Node.js] project for import, i.e. add needed `.project`
	  							and other `.*` files ('.gitignore', '.jshintrc', '.settings/') if there is no `.project` yet
      -g, --eclipse_project_general   prepare General Eclipse project for import, i.e. add only needed `.project` file
	  -n, --name [<name>]      project name (default is folder name)
	  -h, --help               Check README
	  -v, --version            print nodeclipse CLI's version
	  -V, --verbose            be verbose

	Templates are just folders in this project sources:
	  hello-world              	The famous hello world HTTP server in 6 lines
	  hello-coffee	           	The same server written in CoffeeScript
	  hello-typescript         	The same server written in TypeScript
	  hello-html		       	Template with HTML file
	  template-gradle-java     	Gradle Java project
	  template-maven-java      	Maven Java project
	  
Examples:

	nodeclipse -p
	
	nodeclipse --prepare project1
	
	nodeclipse --create project2
	
	nodeclipse --create project3 --use hello-coffee
	
	nodeclipse -c project4 -u hello-coffee


## Nodeclipse CLI installer

Nodeclipse CLI installer is for installing/updating plugins into Eclipse/Enide Studio.
It is much quicker way when you need to automate and know exactly what you need.
Limitation: 
 - no dependencies resolution.
 - only for eclipse in current folder

`nodeclipse -h install`

```
	Nodeclipse CLI Installer
	    nodeclipse help
	    nodeclipse help aliases
	  Usage (from folder with eclipse):
	    nodeclipse list [<repository>]
	      repository may be name (nodeclipse, kepler, luna) or URL (http of file)
	        Repositories names(12): dev nodeclipse-updates enide-repository indigo juno 4.3 kepler 4.4 luna 4.5 mars current
	      default repositoryURL is http://www.nodeclipse.org/updates/
	      <repository> may be file e.g. jar:file:/D:/path/to/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/
	    nodeclipse install <alias|exact.feature.name.feature.group> [...]
	    nodeclipse install from <repository> <alias|exact.feature.name.feature.group> [...]
	    nodeclipse uninstall <alias|exact.feature.name.feature.group> [...]
	    nodeclipse update [from <repository>] <alias|exact.feature.name.feature.group> [...]
	    nodeclipse install all from <repository> // BE CAREFUL WHAT YOU ASK FOR
	    nodeclipse materialize [from <repository>] to <folder>
	    nodeclipse materialize from <repository> [for <environemt>] to <folder>
	        Environment names(5): linux32 linux64 win32 win64 macosx
	        Plugin aliases(25): egit git gfm gradle hudson icons jjs jshint jsdt less markdown maven mongodb mongodb.shell moonrise nodejs pde-tools phantomjs pluginslist restclient shelled startexpl
	orer themes wikitext yaml
	
	    Examples:
	    nodeclipse install nodejs from nodeclipse,kepler
	    nodeclipse install egit
	    nodeclipse install markdown wikitext yaml
	    nodeclipse install from enide less
	    nodeclipse update jshint
	    nodeclipse materialize from luna to D:/Progs/EclipseLuna1/
```    


	cd path/to/eclipse
	nodeclipse install markdown

or if you are in a hurry

	cd path/to/eclipse && nodeclipse i gfm markdown startexplorer
	
If while installing you get errors, that you don't know how to solve, use Eclipse GUI or raise an issue.	

  Usage: nodeclipse install [aliases]
  Mapped aliases: egit git gfm gradle icons jjs markdown mongodb mongodb.shell moonrise nodejs phantomjs pluginslist restclient shelled startexplorer
  
Issues: 
- When updating, I noticed that Eclipse once reported conflict when installing 'nodejs', but was OK for second try.  
- Cannot resolute to install required JSDT for Nodeclipse nodejs. Install JSDT version specific for your Eclipse version using Eclipse GUI.

## Eclipse Workspace and Project

Eclipse Workspace is just folder that contains Eclipse Projects.
Eclipse Projects is just folder with `.project` file.

## Developing Nodeclipse CLI

[#91](https://github.com/Nodeclipse/nodeclipse-1/issues/91)

Project sources are at https://github.com/Nodeclipse/nodeclipse-1
under https://github.com/Nodeclipse/nodeclipse-1/tree/master/org.nodeclipse.ui/templates

<https://npmjs.org/doc/developers.html>

### Hint before publishing

- try with `npm install . -g`
- check that nodeclipse.js (inside `bin` folder) line ending is UNIX style (#101)

[#4341](https://github.com/isaacs/npm/issues/4341) `common-templates/.gitignore` becomes `common-templates/.npmignore` 

#### Links

> The only feature that differentiates a command-line program from a library is the bin field in the package.json file.

<http://howtonode.org/how-to-module>

## History

- 0.8.2 fix #101 (bug on MacOS); -g option
- 0.8.3 fix general project template
- 0.10.0 add 2 java templates
- 0.10.5 add Nodeclipse CLI Installer (example `nodeclipse install markdown`)
- 0.10.6 fix #101 again; total aliases=20 
- 0.10.8 add maven, gradle features; install from .zip; install all 
- 0.10.9 comma-sep-list of repositories; lookup for repositories.  
	Examples: `nci install from kepler jsdt` 
- 0.10.10 uninstall, materialize
	Examples: `nci uninstall mongodb.shell` , `nci new from luna to d:/progs/eclipse-diy-luna/`
- 0.11.0 `update` command as p2-director needs uninstall then install (example `nodeclipse update markdown`)
- 0.17
	- add mars and 4.5 repositories
	- add explicitly `jshint` alias to do `nodeclipse update jshint` (it is also part of `nodejs` alias)
- 0.17.1 Android templates are not ready
- 0.17.2 add AngularJS, Color IDE Pack, Nodeclipse EditBox, Emmet, JDT Spelling, JSHint, TCF-Termnals, Zip Editor

## News

Check <http://www.nodeclipse.org/#news>

## Ideas and TODOs

	  android-application		Eclipse files for Android App (that can be create with  
	  		`android create project -p AppPAKTGV -a MainAcivity -k com.example.apppaktgv -t android-19 -g -v 0.12.+`)	
	  android-library			Eclipse files for Android Library

	$ nodeclipse -h
	Usage: nodeclipse [directory] [arguments]
	
      -f, --force              force on non-empty directory (by default existing files are not updated)
	  -pg					as general project
	  -pn	 				as Nodeclipse Node.js project (default)
	  -t, --template <template>     use/copy specified template when creating project (see also `git init`)
	  --gitclone <repository>			call git clone [directory]
	  --js2njs (renamejs)
	  --njs2js 
	  
TODO Examples:

	git clone repository directory
	nodeclipse directory -pg	
	
	nodeclipse directory -pg --gitclone repository 
	nodeclipse --gitclone repository directory -pg (bad?)
	
Dream - I wish I could get current project in GitHub as project in Eclipse with 1 click.
options are: 	
- eclipse wizards accessible with icon, where I only need to git repository URL
- add link on Wizard Page
- options to refine .jshintrc

Build Eclipse Java Project from Command Line
http://stackoverflow.com/questions/206473/build-eclipse-java-project-from-command-line

List of workspace projects
`<workspace>\.metadata\.plugins\org.eclipse.core.resources\.projects\`

- http://stackoverflow.com/questions/251116/where-in-an-eclipse-workspace-is-the-list-of-projects-stored
- http://stackoverflow.com/questions/1718456/create-an-eclipse-project-on-the-command-line
- http://stackoverflow.com/questions/8908219/eclipse-import-project-using-command-line
- http://stackoverflow.com/questions/206473/build-eclipse-java-project-from-command-line

	eclipsec.exe -noSplash -data "D:\Source\MyProject\workspace" -application org.eclipse.jdt.apt.core.aptBuild
	
	java -cp startup.jar -noSplash -data "D:\Source\MyProject\workspace" -application org.eclipse.jdt.apt.core.aptBuild

