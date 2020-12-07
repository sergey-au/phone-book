# Contacts -  Coding Challenge #

## Prerequisite ##
The following dev tools must be installed before this project can be build and run.

* [Java 11+](https://jdk.java.net/java-se-ri/11)
* [Maven 3.6+](https://maven.apache.org/download.cgi)
* [Node 12+](https://nodejs.org/en/download/)
* [Git](https://git-scm.com/downloads)

## Project Layout ##
This is multi-module Maven project with two submodules:
* **ui**  - frontend written in [react](https://reactjs.org/)
* **api** - backend written in [Spring Boot](https://spring.io/projects/spring-boot)

The ui module is self-contained and has its own [README](ui/README.md). It can be run separately.

## How to run ##
Clone the project.

### Option 1 - Build with the client - release ###
1. From the root execute `mvn -Pwith-client clean install`. This will do the following:
   1. Build frontend (ui) submodule: install Node and npm and build the site
   2. Build backend (api) submodule and bundle the site into the output artifact
2. run cd to api module and run `mvn spring-boot:run` to run the application
3. Open browser to http://localhost:8080

### Option 2 - Build without the client - development ###
1. From the root folder execute `mvn -Pwith-client clean install`
   1. Build frontend (ui) submodule: install Node and npm and build the site
   2. Build backend (api) submodule and bundle the site into the output artifact
2. cd to api module and run 
`mvn -Dspring-boot.run.fork=false -Dspring-boot.run.jvmArguments spring-boot:run` to run the application. This will start 
the service. In the browser navigate to http://localhost:8080
3. In another terminal window change to pcs/ui folder and run `npm start`. This 
will start the node and launch the browser to the app http://localhost:3000. Node will automatically
reload JavaScript and CSS changes.

## Code quality gates ##
* [Checkstyle](https://checkstyle.sourceforge.io/) with [Google Checks](https://github.com/checkstyle/checkstyle/blob/master/src/main/resources/google_checks.xml)
 enforced by [Maven Checkstyle Plugin](https://maven.apache.org/plugins/maven-checkstyle-plugin/)
* [Spotbugs](https://spotbugs.github.io/) enforced [Spotbugs Maven Plugin](https://spotbugs.github.io/spotbugs-maven-plugin/)
* [JaCoCo](https://www.eclemma.org/jacoco/) - Java Code Coverage enforced by [JaCoCo Maven Plugin](https://www.eclemma.org/jacoco/trunk/doc/maven.html)

## Test coverage ##
* JavaScript is in [coverage/lcov-report/index.html](file://coverage/lcov-report/index.html)
* Java is in [api/target/site/index.html](file://api/target/site/jacoco-aggregate/index.html)
## Distribution ##
The frontend and backend packaged in a single war file with embedded web server.

## Links ##
* [How to configure Google Java Style Guide for Intellij or Eclipse](https://github.com/HPI-Information-Systems/Metanome/wiki/Installing-the-google-styleguide-settings-in-intellij-and-eclipse)
* [Google configuration for checkstyle](https://github.com/checkstyle/checkstyle/blob/master/src/main/resources/google_checks.xml)
* [How to install OpenJDK11 on Mac](https://installvirtual.com/install-openjdk-11-mac-using-brew/)
