import nodemailer from 'nodemailer';

import noop from '@tinkoff/utils/function/noop';

import { MAIL_CREDENTIALS } from '../constants/constants';

export default function sendEmail (
    email,
    payload,
    callbacks
) {
    payload = {
        subject: '',
        content: '',
        files: [],
        ...payload
    };
    callbacks = {
        success: noop,
        failure: noop,
        ...callbacks
    };
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: MAIL_CREDENTIALS.login,
            pass: MAIL_CREDENTIALS.password
        }
    });
    const mailOptions = {
        to: email,
        subject: payload.subject,
        html: payload.content,
        attachments: payload.files
    };

    return transporter.sendMail(mailOptions, error => {
        if (error) {
            return callbacks.failure();
        }

        return callbacks.success();
    });
}
