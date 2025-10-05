/**
 * Calcula la edad en años a partir de una fecha de nacimiento
 * @param birthDate - Fecha de nacimiento (Date, string o timestamp)
 * @returns Edad en años completos
 */
export const calculateAge = (birthDate: Date | string | number): number => {
  if (!birthDate) return 0;

  const birth = new Date(birthDate);
  const today = new Date();

  if (isNaN(birth.getTime())) {
    throw new Error('Fecha de nacimiento inválida');
  }

  if (birth > today) {
    throw new Error('La fecha de nacimiento no puede ser futura');
  }

  let   age       = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth()    - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};
