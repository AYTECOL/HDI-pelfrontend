@Library('utils@master') _
import com.lmig.intl.cloud.jenkins.util.EnvConfigUtil
 
def envUtil = new EnvConfigUtil()
countryParams = envUtil.getCountryEnvDetails(env.JOB_NAME)
 
pipeline {
  agent {
    docker { 
      image 'jfrog.hdicolombia.com.co/pod-templates-latam/pipeline2.0.x:latest'
      args '''
        -v /usr/local/aws-cli/:/usr/local/aws-cli/ 
        -v /home/jenkins/sonar-scanner-7.1.0.4889-linux-x64_3/:/home/jenkins/sonar-scanner-7.1.0.4889-linux-x64_3/
        -v /var/lib/jenkins/tools/:/var/lib/jenkins/tools/
      '''
    }
  }
 
  parameters {
    string(name: 'Ref', defaultValue: 'refs/heads/', description: 'Enter Branch Name. Example: master, develop, feature/*, release/*, hotfix/*', trim: true)
    string(name: 'Email', defaultValue: '', description: 'Enter Email notification. Example: pperez@mail.com', trim: true)
  }
 
  options { 
    timestamps()
    timeout(time: 3, unit: 'HOURS')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(daysToKeepStr: '90'))
  }
 
  environment {
    HOME = "${env.WORKSPACE}"
    STAGE = countryParams.countryEnv.toLowerCase()
    VERSION = null
    REPO_NAME = null
    AWS_REGION = "us-east-1"
    BUCKET = null
    CLOUDFRONT_ID = null
  }
 
  stages {
    stage('Continuos Integration') {
      steps {
        dir('shared-pipelines') {
          git branch: 'master', url: 'https://github.com/hdiseguroscol/co-hdi-jenkins-pipelines.git', credentialsId: 'Github-HDI'            
        }
        load 'shared-pipelines/frontend/JenkinsfileReactCI'
      }
    }
 
    stage('Continuos Deployment') {
      steps {
        load 'shared-pipelines/frontend/JenkinsfileReactCD'
      }
    }
 
    stage('Create Invalidation Cloudfront') {
      steps {
        script {
          def stageCreateInvalidationDistribution = load 'shared-pipelines/utils/StageCreateInvalidationDistribution'
          stageCreateInvalidationDistribution.run("poliza-express-hogar-${STAGE}", "cloudfrontId")
        }
      }
    }
 
    stage('Report') {
      steps {
        script {
          load 'shared-pipelines/notification/JenkinsfileReport'
        }
      }
    }

    stage('Testing E2E') {
      steps {
        script {
          def stageRunTestingE2E = load 'shared-pipelines/utils/StageRunTestingE2E'
          stageRunTestingE2E.run("co-hdi-acc-portales/${STAGE}/testing/co-gui-testing-hogar-low-touch", "master")
        }
      }
    }
  }
 
  post {
    always {
      script {
        notification(emails: "${params.Email}")
        cleanWs()
        deleteDir()
      }
    }
  }
}
