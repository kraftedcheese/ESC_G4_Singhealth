//simplest to integrate with backend. simply replace the get/post requests to localstorage to actual REST calls
import axios from "axios";
import useToken from "../useToken";

const KEYS = {
  tenants: "tenants",
  tenant_id: "tenant_id",
};

export const getInstitutionCollection = () => [
  { title: "CGH" },
  { title: "KKH" },
  { title: "SGH" },
  { title: "SKH" },
  { title: "NCCS" },
  { title: "NHCS" },
  { title: "BVH" },
  { title: "OCH" },
  { title: "Academia" },
];

export function insertTenant(data) {
  let tenants = getAllTenants();
  data["tenant_id"] = generateTenantID();
  tenants.push(data);
  localStorage.setItem(KEYS.tenants, JSON.stringify(tenants));
}

export function updateTenant(data) {
  console.log(data);
  let tenants = getAllTenants();
  let recordIndex = tenants.findIndex((x) => x.tenant_id == data.tenant_id);
  tenants[recordIndex] = { ...data };
  localStorage.setItem(KEYS.tenants, JSON.stringify(tenants));
}

export function generateTenantID() {
  if (localStorage.getItem(KEYS.tenant_id) == null)
    localStorage.setItem(KEYS.tenant_id, "0");
  var id = parseInt(localStorage.getItem(KEYS.tenant_id));
  localStorage.setItem(KEYS.tenant_id, (++id).toString());
  return id;
}

export async function getAllTenants(token) {
  if (localStorage.getItem(KEYS.tenants) == null)
    localStorage.setItem(KEYS.tenants, JSON.stringify([]));
  let tenants = JSON.parse(localStorage.getItem(KEYS.tenants));
  return tenants;
}
