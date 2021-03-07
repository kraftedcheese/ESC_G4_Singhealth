const KEYS = {
    tenants: 'tenants',
    tenant_id: 'tenant_id'
}

export const getInstitutionCollection = () => ([
    { id: '1', title: 'CGH' },
    { id: '2', title: 'KKH' },
    { id: '3', title: 'SGH' },
    { id: '4', title: 'SKH' },
    { id: '5', title: 'NCCS' },
    { id: '6', title: 'NHCS' },
    { id: '7', title: 'BVH' },
    { id: '8', title: 'OCH' },
    { id: '9', title: 'Academia' },
])

export function insertTenant(data) {
    let tenants = getAllTenants();
    data['tenant_id'] = generateTenantID()
    tenants.push(data)
    localStorage.setItem(KEYS.tenants, JSON.stringify(tenants))
}

export function updateTenant(data) {
    console.log(data)
    let tenants = getAllTenants();
    let recordIndex = tenants.findIndex(x => x.tenant_id == data.tenant_id);
    tenants[recordIndex] = { ...data }
    localStorage.setItem(KEYS.tenants, JSON.stringify(tenants));
}

export function generateTenantID() {
    if (localStorage.getItem(KEYS.tenant_id) == null)
        localStorage.setItem(KEYS.tenant_id, '0')
    var id = parseInt(localStorage.getItem(KEYS.tenant_id))
    localStorage.setItem(KEYS.tenant_id, (++id).toString())
    return id;
}

export function getAllTenants() {
    if (localStorage.getItem(KEYS.tenants) == null)
        localStorage.setItem(KEYS.tenants, JSON.stringify([]))
    let tenants = JSON.parse(localStorage.getItem(KEYS.tenants));
    //map institutionID to institution title
    let institutions = getInstitutionCollection();
    return tenants.map(x => ({
        ...x,
        institution: institutions[x.tenant_id - 1].title
    }))
}