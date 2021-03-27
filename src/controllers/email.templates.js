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
      Para confirmar o seu e-mail informado, <a href=https://dentaldiet.web.app/Confirm/${id}>clique aqui.</a><br />
      <br />
      Obrigado por utilizar nossos serviços. Qualquer dúvida, entre em contato conosco.<br />
      <br />
      Atenciosamente,<br />
      <br />
      Equipe Dental Diet<br />
      https://dentaldiet.web.app/
    `,      
    text: `Copie e cole esse link: https://dentaldiet.web.app/Confirm/${id}`
  }),  
}