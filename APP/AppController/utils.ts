/* eslint-disable prettier/prettier */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')} ${period}`;
}

export const getHorarioFormatting = (horarios: string[], currentDay = true) => {
  if (horarios.length === 0) {
    return 'Sin horario por hoy';
  }
  let text = '';
  for (const horario of horarios) {
    if (text.length !== 0) {
      text += '\n';
    }
    const cLetter = horario.indexOf('C');
    const abiertoMin = horario.substring(2, cLetter);
    const cerradoMin = horario.substring(cLetter + 1);
    const abierto = formatTime(abiertoMin);
    const cerrado = formatTime(cerradoMin);
    text += `${abierto} A ${cerrado}`;
  }
  return text;
};

export const diaSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
