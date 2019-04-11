#!/bin/groovy
pipeline {
  agent any
  tools {nodejs "NodeJSInstall"}
  stages {
    stage('Clone') {
      steps {
        script {
          sh 'rm -fr libertyhomefront && git clone git@bitbucket.org:Amaris_col/libertyhomefront.git && cd libertyhomefront && git checkout ma-sprint-3 && git pull origin ma-sprint-3'
        }
      }
    }
    stage('Yarn') {
      steps {
        script {
          sh 'npm install -g yarn'
        }
      }
    }
    stage('Startup') {
      steps {
        script {
          sh 'cd libertyhomefront && yarn install'
        }
      }
    }
    stage('Test') {
      steps {
        script {
          sh 'cd libertyhomefront && yarn run test:ci'
        }
      }all-build-years
      post {
        always {
          step([
            $class: 'CloverPublisher',
            cloverReportDir: "${JENKINS_HOME}/workspace/Tests/libertyhomefront/coverage/",
            cloverReportFileName: 'clover.xml',
            healthyTarget: [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],
            unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50],
            failingTarget: [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]
          ])
        }
      }
    }
  }
}