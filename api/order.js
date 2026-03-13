// api/order.js
export default function handler(request, response) {
  if (request.method === 'POST') {
    const { items, total, customerName } = request.body;

    // Ici, tu pourrais envoyer un mail avec Nodemailer 
    // ou enregistrer dans une base de données Supabase.

    return response.status(200).json({ 
      message: "Commande reçue côté serveur !",
      whatsappUrl: `https://wa.me/50941172815?text=...` 
    });
  } else {
    response.status(405).send('Méthode non autorisée');
  }
}
