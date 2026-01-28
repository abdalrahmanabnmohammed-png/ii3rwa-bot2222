// أضف هذه الـ States في بداية المكون
const [serverRoles, setServerRoles] = useState([]);
const [selectedDiscordRole, setSelectedDiscordRole] = useState("1424535593324646431"); // الرتبة الافتراضية

// دالة جلب الرتب
useEffect(() => {
  const fetchRoles = async () => {
    const res = await fetch('/api/guild/roles');
    if (res.ok) {
      const data = await res.json();
      setServerRoles(data.roles);
    }
  };
  fetchRoles();
}, []);

// في جزء الـ JSX (واجهة المستخدم)، أضف قائمة الاختيار:
<select 
  className="bg-black/50 p-4 rounded-2xl border border-white/10 outline-none"
  value={selectedDiscordRole} 
  onChange={(e) => setSelectedDiscordRole(e.target.value)}
>
  {serverRoles.map(role => (
    <option key={role.id} value={role.id}>
      {role.name}
    </option>
  ))}
</select>
