@Library('utils@master') _
import com.lmig.intl.cloud.jenkins.util.EnvConfigUtil
def MAJOR_VERSION = "1";
def ARTIFACT_VERSION = "${MAJOR_VERSION}.${BUILD_NUMBER}";

node('linux') {
    stage('SCM') {
        checkout scm
    }

    def envUtil = new EnvConfigUtil()
    countryParams = envUtil.getCountryEnvDetails(env.JOB_NAME)
    echo "Working in env: ${countryParams.countryEnv}"
    
    stage('zipping Files'){
        sh 'zip -r public.zip public'
		sh 'zip -r src.zip src'
    }
    stage('Upload to Artifactory'){
        def artifacts = ['public.zip','src.zip','package.json']
        artifactoryUploadFiles files:artifacts,version:ARTIFACT_VERSION
    }
}
stage('Upload to Artifactory Prod'){
       promoteToProd(email:'carlos.unate@libertycolombia.com', version:ARTIFACT_VERSION){}
}
