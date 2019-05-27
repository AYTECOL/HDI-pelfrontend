
@Library('utils@master') _
node('linux') {
   if(JOB_NAME == "Colombia/dev/andino-flex-touch-back-sqsservicesecuence-job-app-infr"){
            //def mvnHome
            /*
            *seccion para garantizar que las dependencias necesarias, lenguajes y librerias, existan
            */
            stage('Preparation') { // for display purposes
                     //1. necesito instalacion de npm
                     sh 'npm --version'
                     //2. garantizar que la version de aws corresponde
                     sh 'aws --version'
                     //3. clonar todo el proyecto (al principio se clona unicamente el jenkinsfile)
                     git credentialsId: 'intl_gituser', url: 'https://intl_gituser@bitbucket-latam.aws.lmig.com/scm/aa/andino-flex-touch-front-infr.git', branch: 'master'
                     //3.  instalar dependencias del proyecto https://Sergio.Plata@bitbucket-latam.aws.lmig.com/scm/aa/andino-flex-touch-front-front-infr.git
                     sh 'npm install'
                     sh 'npm install  @angular/cli@7.0.7'
                     sh 'npm run build --prod'
                     sh 'echo $PATH'
                     sh 'whereis @angular/cli@7.0.7'
                     //sh 'export '
                     //4. validar version de serverless
                     //sh 'sls --version'
                     //5. escribir en el log la ubicacion actual de la ejecucion
                     sh 'pwd'
                     sh 'ls'
                     sh 'dir'

            }
            stage('Build') {
               /*
               *aca se hace la construccion del proyecto
               *deployToDev es un metodo generado por el equipo de kyle Labbe para el despliegue hacia entorno
               *de desarrollo
               */
               deployToNonProd{
                  //deployToDev{   
                     withAWS(credentials:getAWSCredentialID(environment:"${env.APPENV}"), region:'us-east-1') {
                        //testing dir
                        sh 'dir'
                        //testing file structure
                        sh 'ls'
                        //generar la distribucion, a s3 solo deben ir archivos minificados
                        //sh 'ng build --prod'
                        //navego dentro de las carpetas generadas de la distribucion
                        //sh 'cd dist'
                     // sh 'aws iam delete-role --role-name ebonds-front-V4-nonprod-us-east-1-lambdaRole'
                        sh "sls deploy -v --stage ${env.APPENV.replace('_', '')}"
                        dir('dist/andino-flex-touch-front'){
                           sh 'pwd'
                           sh 'ls'
                           //sh 'serverless syncToS3'
                           //sh 'serverless invalidateCloudFrontCache'
                        // sh 'aws s3 rm s3://cumplimiento-uatv1 --recursive'
                           //sh 'aws s3 sync .  s3://cumplimiento-uatv1'
                        }
                     
                        //elimino todo el contenido del bucket, para garantizar la copia limpia de los recursos
                        //sh 'aws s3 rm s3://sp4-col-flex-touch-front-dev2 --recursive'
                        //ejecuto la sincronizacion de los recursos entre el s3 que esta vacio y la carpeta de distribucion
                        //sh 'aws s3 sync .  s3://sp4-col-flex-touch-front-dev2'
                        
                     }
                  }
                  
                  
               }
   }else if( JOB_NAME == 'Colombia/prod/Colombia-LowTouch-eBonds/7-andino-flex-touch-front-infr'){
            //def mvnHome
            /*
            *seccion para garantizar que las dependencias necesarias, lenguajes y librerias, existan
            */
            stage('Preparation') { // for display purposes
                     //1. necesito instalacion de npm
                     sh 'npm --version'
                     //2. garantizar que la version de aws corresponde
                     sh 'aws --version'
                     //3. clonar todo el proyecto (al principio se clona unicamente el jenkinsfile)
                     git credentialsId: 'intl_gituser', url: 'https://intl_gituser@bitbucket-latam.aws.lmig.com/scm/aa/andino-flex-touch-front-infr.git', branch: 'prod'
                     //3.  instalar dependencias del proyecto https://Sergio.Plata@bitbucket-latam.aws.lmig.com/scm/aa/andino-flex-touch-front-front-infr.git
                     sh 'npm install'
                     sh 'echo $PATH'
                     //4. escribir en el log la ubicacion actual de la ejecucion
                     sh 'pwd'
                     sh 'ls'
                     sh 'dir'

            }
            stage('Build') {
                sh 'serverless package'
               sh 'ls'
                     def artifacts = []
                     artifacts.push("cloudformation-template-create-stack.json")
                     artifacts.push("prod_Jenkinsfile.groovy")
                     artifactoryUploadFiles files:artifacts
                        withAWS(credentials:getAWSCredentialID(environment:"${env.APPENV}"), region:'us-east-1') {
                           sh 'dir'
                           sh 'ls'
                           sh "sls deploy -v --stage prod" 
                      }
                 
               }

   }
   
  
}