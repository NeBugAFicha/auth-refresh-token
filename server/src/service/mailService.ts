import nodemailer from 'nodemailer'
type ProcessEnv =  {
  SMTP_HOST: string, 
  SMTP_PORT: string,
  SMTP_USER: string,
  API_URL: string,
  SMTP_REFRESH_TOKEN: string,
  SMTP_CLIENT_ID: string,
  SMTP_CLIENT_SECRET: string,
};

const {SMTP_HOST, SMTP_PORT, SMTP_USER, API_URL,SMTP_REFRESH_TOKEN,SMTP_CLIENT_ID,SMTP_CLIENT_SECRET}= process.env;
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

class MailService{

    async createTransporter(){
        const oauth2Client = new OAuth2(
            SMTP_CLIENT_ID,
            SMTP_CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
      
        oauth2Client.setCredentials({
          refresh_token: SMTP_REFRESH_TOKEN
        });
      
        const accessToken = await new Promise((resolve, reject) => {
          oauth2Client.getAccessToken((err, token) => {
            if (err) {
              reject();
            }
            resolve(token);
          });
        });
      
        const transporter = nodemailer.createTransport({
            host:SMTP_HOST,
            port:SMTP_PORT,
            secure: true,
            auth: {
                type: "OAuth2",
                user: SMTP_USER,
                accessToken,
                clientId: SMTP_CLIENT_ID,
                clientSecret: SMTP_CLIENT_SECRET,
                refreshToken: SMTP_REFRESH_TOKEN
            }
        });
      
        return transporter;
      }


    async sendActivationLink(to: string,activation_link: string){
        let transporter = await this.createTransporter();
        await transporter.sendMail({
            from:SMTP_USER,
            to,
            subject: `Активация аккаунта на ${API_URL}`,
            text:'',
            html:
                `
                    <div>
                        <h1>Для активации аккаунта перейдите по ссылке</h1>
                        <a href="${activation_link}">${activation_link}</a>
                    </div>
                ` 
        })
    }
}

export default new MailService();