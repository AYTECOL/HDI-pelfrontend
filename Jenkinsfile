@Library('utils@master') _
import com.lmig.intl.cloud.jenkins.util.EnvConfigUtil

def envUtil = new EnvConfigUtil()
countryParams = envUtil.getCountryEnvDetails(env.JOB_NAME)

pipeline {
  agent {
    docker { 
      image 'jfrog.hdicolombia.com.co/pod-templates-latam/java11-node16-mvn3.9.x-pipeline2.0.x:latest'
      args '''
        -v /usr/lib/jvm/java-17-amazon-corretto.x86_64:/usr/lib/jvm/java-17-amazon-corretto.x86_64 
        -v /usr/local/aws-cli/:/usr/local/aws-cli/ 
        -v /home/jenkins/sonar-scanner-3.2.0.1227-linux/:/home/jenkins/sonar-scanner-3.2.0.1227-linux/
        --add-host sonarold.hdiseguros.com.co:172.19.0.102  
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
  }

  post {
    always {
      script {
        cleanWs()
        deleteDir()
      }
    }
    // success {
    //   script {
    //     notificationSuccess {

    //     }
    //   }
    // }
    // failure {
    //   notificationError {
          
    //   }
    // }
  }
}