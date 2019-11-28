@Library('utils@master') _
import com.lmig.intl.cloud.jenkins.util.EnvConfigUtil
def MAJOR_VERSION = "1";
def ARTIFACT_VERSION = "${MAJOR_VERSION}.${BUILD_NUMBER}";

properties([
	parameters([
		string(defaultValue: '', description: 'The build version to be deployed', name: 'APP_VERSION'),
    choice(choices: 'dev\nonprod\nprod', description: 'The environment to be deployed', name: 'ENVIRONMENT'),
    choice(choices: "Claire Montgomery\nMichael O'Reilly\nMark McKim\nMichael Wallace\nChristopher Mowbray", description: 'The name of the approver (only required for prod)', name: 'APPROVER')
	])
])

node('linux') {
    stage('SCM') {
        checkout scm
    }

    def envUtil = new EnvConfigUtil()
    countryParams = envUtil.getCountryEnvDetails(env.JOB_NAME)
    echo "Working in env: ${countryParams.countryEnv}"
    
    stage('zipping Files'){
        //sh 'zip -r public.zip public'
		//sh 'zip -r src.zip src'
       zip dir: '', glob: '', zipFile: 'intl-co-ehome-pelhfrontend.zip'
    }
    stage('Upload to Artifactory'){
        def artifacts = ['intl-co-ehome-pelhfrontend.zip']
       //artifactoryUploadFiles files:artifacts,version:ARTIFACT_VERSION
       artifactoryUploadFiles files:artifacts,version:ARTIFACT_VERSION,packageType:'npm',appName:'intl-co-ehome-pelhfrontend'
    }
}
script {
  if(ENVIRONMENT == 'prod') {
stage('Upload to Artifactory Prod'){
       //promoteToProd(email:'Andres.Gallardo@Libertycolombia.com', version:ARTIFACT_VERSION){}
       promoteToProd(email:'Andres.Gallardo@Libertycolombia.com', files:["intl-co-ehome-pelhfrontend.zip"], location:'.', appName:'intl-co-ehome-pelhfrontend', version:ARTIFACT_VERSION){}
       } 
  }
}
