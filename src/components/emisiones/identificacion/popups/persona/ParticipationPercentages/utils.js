import { roles } from '../../../constants';

export const fieldsParticipation = {
  personalAccidents: 'personalAccidents',
  exequiasParticipation: 'exequiasParticipation',
};
const { personalAccidents, exequiasParticipation } = fieldsParticipation;

export const participationValues = Object.values(fieldsParticipation);

/**
 * @typedef {Record<keyof typeof fieldsParticipation, number>} ParticipationPercentage
 */
/**
 * @typedef {{
 *  name: string,
 *  personalAccidents: string,
 *  exequiasParticipation: string,
 *  role: number[]
 * }} Person
 */

export const rolesParticipations = {
  [personalAccidents]: [roles.personalAccidents],
  [exequiasParticipation]: [roles.obsequies],
};

/**
 * @param  {Person[]} persons
 * @param  {keyof typeof fieldsParticipation} key
 * @return {ParticipationPercentage}
 */
export const getTotalParticipationPercentage = (persons, key) => {
  const defaultValue = 0;
  return persons.reduce((c, p) => {
    const roleActived = isRoleParticipation(key, p.role);
    if (roleActived && typeof p[key] === 'number') c += p[key];
    return c;
  }, defaultValue);
};
/**
 * @param  {Person[]} persons
 * @return {ParticipationPercentage}
 */
export const getTotalParticipationPercentages = (persons) => {
  /**
   * @type {ParticipationPercentage}
   */
  const defaultValue = participationValues.reduce(
    (v, p) => ({ ...v, [p]: 0 }),
    {}
  );
  return participationValues.reduce((c, key) => {
    c[key] = getTotalParticipationPercentage(persons, key);
    return c;
  }, defaultValue);
};
/**
 * @param  {Person[]} persons
 * @return {ParticipationPercentage}
 */
export const getMaxParticipationPercentage = (persons) => {
  const total = { ...getTotalParticipationPercentages(persons) };
  participationValues.forEach((value) => (total[value] = 100 - total[value]));
  return total;
};

export const validatePercentageField = (value) => {
  if (!value || Number(value) < 1) {
    return false;
  }
  return true;
};

/**
 *
 * @param {keyof typeof fieldsParticipation} field
 * @param {number[]} roles
 */
export const isRoleParticipation = (field, roles) => {
  const rolesParticipation = rolesParticipations[field] || [];
  const roleActived = rolesParticipation.some((role) =>
    roles.some((r) => r === role)
  );
  return roleActived;
};

export const isTotalValid = (total) => {
  return total === 100;
};

/**
 * @param  {Person[]} persons
 * @param  {keyof typeof fieldsParticipation} key
 * @return {boolean}
 */
export const validateParticipationPercentage = (persons, key) => {
  const valid = !persons.some((p) => {
    const roleActived = isRoleParticipation(key, p.role);
    if (roleActived && !validatePercentageField(p[key])) return true;
    return false;
  });
  return valid;
};
