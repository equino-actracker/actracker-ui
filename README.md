# Actracker UI

Angular project bootstrapped with Gradle according to this tutorial:
https://ordina-jworks.github.io/architecture/2018/10/12/spring-boot-angular-gradle.html

Sample implementation:
https://github.com/gurtjun/angular-spring-boot-gradle

`--base-href .` was added as build parameter in package.json to correctly handle changed application context path


## Running locally with NG (recommended):
### Locally run backend:
```
cd actracker-ui-angular
ng serve
```

### Remote backend:
```
cd actracker-ui-angular
ng serve --configuration dev
```
After Angular starts the web server, open your browser and go to http://localhost:4200

## Running locally with Gradle:
### Locally run backend:
```
./gradlew clean build bootRun
```

### Remote backend:
```
SPRING_PROFILES_ACTIVE=DEV ./gradlew clean build bootRun
```
After Angular starts the web server, open your browser and go to http://localhost:8080/actracker-ui
