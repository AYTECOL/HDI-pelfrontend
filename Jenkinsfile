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
    stage ('cloudfront'){
        "AWSTemplateFormatVersion" : "2010-09-09",
        "Resources" : {
            "myDistribution" : {
                "Type" : "AWS::CloudFront::Distribution",
                "Properties" : {
                    "DistributionConfig" : {
                        "Origins" : [ {
                            "DomainName" : "hogar-uat.libertyseguros.co",
                            "HTTPPort" : 80,
                            "HTTPSPort" : 443,
                            "OriginProtocolPolicy": "https-only"
                            "S3OriginConfig" : {
                              "OriginAccessIdentity": "origin-access-identity/cloudfront/libertyhome-dev-app",      
                            }
                        }],
                        "Enabled" : "true",
                        "Comment" : "Some comment",
                        "DefaultRootObject" : "index.html",
                        "Logging" : {
                            "IncludeCookies" : "false",
                            "Bucket" : "poliza-express-hogar-front"
                        },
                        "Aliases" : [ "hogar-uat.libertyseguros.co" , "hogar.libertyseguros.co"],
                        "DefaultCacheBehavior" : {
                            "AllowedMethods" : [ "DELETE", "GET", "OPTIONS", "POST", "PUT" ],  
                            "TargetOriginId" : "WebApp",
                            "ForwardedValues" : {
                                "QueryString" : "false",
                                "Cookies" : { "Forward" : "none" }
                            },
                            "ViewerProtocolPolicy" : "allow-all"
                        },
                      "PriceClass" : "PriceClass_200",
                      "ViewerCertificate" : { "CloudFrontDefaultCertificate" : "true" }  
                    }
                }
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