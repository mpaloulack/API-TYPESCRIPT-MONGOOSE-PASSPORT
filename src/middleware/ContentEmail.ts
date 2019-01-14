const registerHTML =  `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge"'>+
 <title>Welcom</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <p>
       Welcome {{username}} to our website. There is only one step left to access your account
  </p>
  <a href="http://{{sitename}}/user/validate/{{token}}"
  target="_blank" rel="noopener noreferrer">Click here to validate account</a>
</body>
</html>`;

const registerSubject = "Welcome to our website";

export const registerEmail = {
    html : registerHTML,
    subject: registerSubject,
};
