// script.js
async function validateAndSubmit() {
  const selectedDate = document.getElementById("date").value;
  const selectedTime = document.getElementById("time").value;

  // Verifica se a data e o horário foram preenchidos
  if (!selectedDate || !selectedTime) {
    alert("Preencha todos os campos!");
    return;
  }

  // Busca horários já agendados
  const availableTimes = await fetchAvailableTimes(selectedDate);

  // Verifica se o horário está disponível
  if (!availableTimes.includes(selectedTime)) {
    alert("Este horário já está agendado. Escolha outro.");
    return; // Impede o envio
  }

  // Envia os dados se tudo estiver correto
  submitToGoogleForms(selectedDate, selectedTime);
}

async function fetchAvailableTimes(date) {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRN-2KA2SclPTnXVwwcsAyd3HYUSfmkmOijeOPaj4Ru3u_t2kcHN5oMHlGZRh5RvCvgMoYjlBNjWMe5/pub?gid=1536336991&single=true&output=csv";
  const response = await fetch(sheetUrl);
  const text = await response.text();
  const rows = text.split("\n").map(row => row.split(","));
  const bookedTimes = rows.filter(row => row[0] === date).map(row => row[1]);
  const allTimes = ["8:00", "9:00", "10:00", "11:00"];
  return allTimes.filter(time => !bookedTimes.includes(time));
}

function submitToGoogleForms(date, time) {
  const formUrl = "SUA_URL_DO_GOOGLE_FORMS_AQUI"; // Cole a URL aqui!
  const formData = new FormData();

  // Adicione os IDs dos campos (exemplo):
  formData.append("entry.662316999", date); // ID do campo "Data"
  formData.append("entry.900855182", time); // ID do campo "Horário"
  formData.append("entry.1826372177", document.getElementById("nome").value); // ID do campo "Nome"
  formData.append("entry.1685976361", document.getElementById("telefone").value); // ID do campo "telefone"
  formData.append("entry.241846591", document.getElementById("email").value); // ID do campo "E-mail"

  fetch(formUrl, {
    method: "POST",
    body: new URLSearchParams(formData),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(() => {
      alert("Agendamento realizado com sucesso!");
      document.getElementById("customForm").reset(); // Limpa o formulário
    })
    .catch(() => alert("Erro ao enviar o formulário."));
}
