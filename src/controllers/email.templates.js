// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily 
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
module.exports = {

  confirm: (id, nome) => ({
    subject: 'Cadastro Dental Diet - Confirmação de e-mail',
    html: `
    'Prezado(a) ' ${nome}, <br />
      <br />
      Para confirmar o seu e-mail informado, <a href=https://dental-diet.web.app/Confirm/${id}>clique aqui.</a><br />
      <br />
      Obrigado por utilizar nossos serviços. Qualquer dúvida, entre em contato conosco.<br />
      <br />
      Atenciosamente,<br />
      <br />
      Equipe Dental Diet<br />
      https://dental-diet.web.app/
    `,      
    text: `Copie e cole esse link: https://dental-diet.web.app/Confirm/${id}`
  }),  

  forgot: token => ({
    subject: 'Dental Diet - Recuperação de senha',
    text: `
      Você está recebendo esse e-mail porque você ou outra pessoa solicitou uma mudança de senha para sua conta. \n\n
      Por favor clique no link abaixo, ou copie e cole em seu navegador para completar o processo dentro de uma hora desde o recebimento deste. \n\n
      https://dental-diet.web.app/AlterarSenha/${token} \n\n
      Caso você não tenha requisitado essa alteração, favor ignorar este e-mail e sua senha permanecerá inalterada.
    `,
  })
}