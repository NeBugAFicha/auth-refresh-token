const nodemailer = require('nodemailer');
const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, API_URL} = process.env;

class MailService{
    constructor(){
        this.transporter = nodemailer.createTransport({
            host:SMTP_HOST,
            port:SMTP_PORT,
            secure: false,
            auth:{
                user:SMTP_USER,
                pass:SMTP_PASSWORD
            }
        })
    }
    async sendActivationLink(to,activation_link){
        await this.transporter.sendMail({
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

module.exports = new MailService();