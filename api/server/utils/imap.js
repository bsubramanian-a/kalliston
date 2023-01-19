// const { ImapFlow } = require('imapflow');

// imapClient = new ImapFlow({
//     host: process.env.EMAIL_HOST,
//     port: 993,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// const sendImapEmail = () => {
//     await imapClient.connect();

//   // Select and lock a mailbox. Throws if mailbox does not exist
//   let lock = await client.getMailboxLock('INBOX');
//   try {
//       // fetch latest message source
//       // client.mailbox includes information about currently selected mailbox
//       // "exists" value is also the largest sequence number available in the mailbox
//       let message = await client.fetchOne(client.mailbox.exists, { source: true });
//       console.log(message.source.toString());

//       // list subjects for all messages
//       // uid value is always included in FETCH response, envelope strings are in unicode.
//       for await (let message of client.fetch('1:*', { envelope: true })) {
//           console.log(`${message.uid}: ${message.envelope.subject}`);
//       }
//   } finally {
//       // Make sure lock is released, otherwise next `getMailboxLock()` never returns
//       lock.release();
//   }

//   // log out and close connection
//   await client.logout();
// }

// export default sendImapEmail();

module.exports.READ_MAIL_CONFIG = {
    imap: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: process.env.EMAIL_HOST,
      port: 993,
      authTimeout: 10000,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    },
};
  
module.exports.SEND_MAIL_CONFIG = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
};