import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Leaf, Recycle, Truck, Wallet, PlusCircle, Calendar, Phone, Mail, MapPin, IndianRupee, Package, CheckCircle2, Clock, Sprout, ShieldCheck, Home, LayoutDashboard, LogIn, LogOut, User2, Camera, Gift, BadgeCheck, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

// ----------------------------------------------
// Utility helpers
// ----------------------------------------------
const LS_KEYS = {
  ORDERS: "seedpods_orders_v1",
  USER: "seedpods_user_v1",
  ADMIN: "seedpods_admin_v1",
};

const saveLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const readLS = (k, d) => {
  try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; }
};

const fmtINR = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const SEEDS = [
  { id: "tulsi", name: "तुलसी (Tulsi)" },
  { id: "mint", name: "पुदीना (Mint)" },
  { id: "coriander", name: "धनिया (Coriander)" },
  { id: "tomato", name: "टमाटर (Tomato)" },
  { id: "chilli", name: "मिर्च (Chilli)" },
];

const BASE_PRICE = 29; // base service fee
const POD_PRICE = 6;   // per pod price
const EXPRESS_FEE = 25;

const STATUS_STEPS = [
  { key: "placed", label: "Placed" },
  { key: "scheduled", label: "Pickup Scheduled" },
  { key: "picked", label: "Waste Picked" },
  { key: "making", label: "Pods in Making" },
  { key: "ready", label: "Pods Ready" },
  { key: "delivered", label: "Delivered" },
];

// ----------------------------------------------
// Root App
// ----------------------------------------------
export default function App() {
  const [tab, setTab] = useState("home");
  const [orders, setOrders] = useState(() => readLS(LS_KEYS.ORDERS, []));
  const [user, setUser] = useState(() => readLS(LS_KEYS.USER, null));
  const [adminMode, setAdminMode] = useState(() => readLS(LS_KEYS.ADMIN, false));

  useEffect(() => saveLS(LS_KEYS.ORDERS, orders), [orders]);
  useEffect(() => saveLS(LS_KEYS.USER, user), [user]);
  useEffect(() => saveLS(LS_KEYS.ADMIN, adminMode), [adminMode]);

  const myOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter(o => o.user?.email === user?.email);
  }, [orders, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-800">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-emerald-100"><Leaf className="w-6 h-6 text-emerald-600"/></div>
            <div>
              <div className="text-xl font-bold">EcoPods</div>
              <div className="text-xs text-slate-500">Waste → Seed Pods, Delivered</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <TopNavButton icon={<Home className="w-4 h-4"/>} label="Home" onClick={() => setTab("home")} active={tab==="home"}/>
            <TopNavButton icon={<PlusCircle className="w-4 h-4"/>} label="Request Pods" onClick={() => setTab("order")} active={tab==="order"}/>
            <TopNavButton icon={<Package className="w-4 h-4"/>} label="My Orders" onClick={() => setTab("myorders")} active={tab==="myorders"}/>
            <TopNavButton icon={<LayoutDashboard className="w-4 h-4"/>} label="Admin" onClick={() => setTab("admin")} active={tab==="admin"}/>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-2xl">Eco-Points: {user.points ?? 0}</Badge>
                <Button variant="outline" size="sm" onClick={() => setTab("myorders")} className="rounded-2xl"><User2 className="mr-2 w-4 h-4"/>{user.name || "You"}</Button>
                <Button size="sm" variant="ghost" onClick={() => setUser(null)} className="rounded-2xl"><LogOut className="w-4 h-4"/></Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setTab("auth")} className="rounded-2xl"><LogIn className="mr-2 w-4 h-4"/>Sign in</Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {tab === "home" && (
            <motion.div key="home" initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} exit={{opacity:0, y:-8}}>
              <Hero setTab={setTab} />
              <HowItWorks />
              <WhyUs />
            </motion.div>
          )}
          {tab === "order" && (
            <motion.div key="order" initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} exit={{opacity:0, y:-8}}>
              <OrderForm user={user} onRequireAuth={()=>setTab("auth")} onSubmit={(o)=>setOrders([o,...orders])}/>
            </motion.div>
          )}
          {tab === "myorders" && (
            <motion.div key="myorders" initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} exit={{opacity:0, y:-8}}>
              <MyOrders orders={myOrders} />
            </motion.div>
          )}
          {tab === "admin" && (
            <motion.div key="admin" initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} exit={{opacity:0, y:-8}}>
              <AdminPanel adminMode={adminMode} setAdminMode={setAdminMode} orders={orders} setOrders={setOrders} setUser={setUser}/>
            </motion.div>
          )}
          {tab === "auth" && (
            <motion.div key="auth" initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} exit={{opacity:0, y:-8}}>
              <Auth onLogin={(u)=>{ setUser(u); setTab("order"); }}/>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div>
            <div className="font-semibold mb-2">EcoPods</div>
            Turning old newspapers & egg shells into plantable seed pods. ♻️🌱
          </div>
          <div>
            <div className="font-semibold mb-2">Contact</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4"/> +91 9102422984</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4"/> varungecsiwan@gmail.com</div>
          </div>
          <div>
            <div className="font-semibold mb-2">Made for</div>
            Best-out-of-Waste • Green Campus • Community Drives
          </div>
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------
// UI Bits
// ----------------------------------------------
function TopNavButton({ icon, label, onClick, active }){
  return (
    <Button variant={active?"default":"ghost"} className={`rounded-2xl ${active?"bg-emerald-600 hover:bg-emerald-700":""}`} onClick={onClick}>
      <span className="mr-2">{icon}</span>{label}
    </Button>
  );
}

function Hero({ setTab }){
  return (
    <section className="grid md:grid-cols-2 gap-6 items-center">
      <div>
        <motion.h1 initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="text-3xl md:text-5xl font-extrabold leading-tight">
          बायोडिग्रेडेबल Seed Pods
        </motion.h1>
        <p className="text-slate-600 mt-3">अपना <b>अख़बार/अंडे के छिलके</b> दें, हम उनसे <b>सीड पॉड्स</b> बनाकर आपके घर डिलीवर कर देंगे। Zero-waste • Low-cost • High-impact 🌱</p>
        <div className="flex gap-3 mt-5">
          <Button className="rounded-2xl" onClick={()=>setTab("order")}><PlusCircle className="mr-2 w-4 h-4"/>Request Pickup</Button>
          <Button variant="outline" className="rounded-2xl" onClick={()=>setTab("myorders")}><Package className="mr-2 w-4 h-4"/>Track Orders</Button>
        </div>
        <div className="flex gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2"><Recycle className="w-4 h-4 text-emerald-600"/> Reuse waste</div>
          <div className="flex items-center gap-2"><Sprout className="w-4 h-4 text-emerald-600"/> Grow plants</div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600"/> Eco friendly</div>
        </div>
      </div>
      <motion.div initial={{opacity:0, scale:.96}} animate={{opacity:1, scale:1}} className="">
        <Card className="rounded-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Camera className="w-5 h-5"/> What we collect</CardTitle>
            <CardDescription>पुराने अख़बार, मैगज़ीन, कार्डबोर्ड, अंडे के छिलके</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Badge className="justify-center py-2 rounded-2xl" variant="secondary">📰 Newspaper</Badge>
              <Badge className="justify-center py-2 rounded-2xl" variant="secondary">🥚 Egg shells</Badge>
              <Badge className="justify-center py-2 rounded-2xl" variant="secondary">📦 Cardboard</Badge>
              <Badge className="justify-center py-2 rounded-2xl" variant="secondary">📒 Old notebooks</Badge>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-2xl text-emerald-900 text-xs">
              We follow the exact DIY method you described: paper pulp + ground eggshells + molds + seeds → dry → deliver pods. ✨
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}

function HowItWorks(){
  const steps = [
    { icon: <PlusCircle className="w-5 h-5"/>, title: "Fill request", desc: "Select waste, seeds, address, schedule pickup" },
    { icon: <Wallet className="w-5 h-5"/>, title: "Pay small fee", desc: "Base + per-pod pricing, UPI-ready" },
    { icon: <Truck className="w-5 h-5"/>, title: "Pickup & craft", desc: "We collect waste and craft biodegradable pods" },
    { icon: <Sprout className="w-5 h-5"/>, title: "Deliver & grow", desc: "Pods arrive. Plant them directly—paper dissolves" },
  ];
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">How it works</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {steps.map((s, i)=> (
          <Card key={i} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">{s.icon}{s.title}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function WhyUs(){
  const points = [
    { icon: <Recycle className="w-5 h-5"/>, title: "Zero/Low cost", desc: "We convert your waste into value"},
    { icon: <Sprout className="w-5 h-5"/>, title: "Practical", desc: "Pods actually sprout—great for demos"},
    { icon: <Gift className="w-5 h-5"/>, title: "Eco points", desc: "Earn points, redeem for free pods"},
  ];
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Why EcoPods?</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {points.map((p, i)=> (
          <Card key={i} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">{p.icon}{p.title}</CardTitle>
              <CardDescription>{p.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------
// Auth (very simple, email-based)
// ----------------------------------------------
function Auth({ onLogin }){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="max-w-xl mx-auto">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl">Create account / Sign in</CardTitle>
          <CardDescription>Just give us your details once. We’ll save them for fast checkout.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="10-digit"/>
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
          </div>
          <div>
            <Label>Address</Label>
            <Textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="House, Street, Area, City, Pincode"/>
          </div>
          <Button className="rounded-2xl" onClick={()=>{
            if(!email) return alert("Email required");
            onLogin({ name, email, phone, address, points: 0 });
          }}><BadgeCheck className="w-4 h-4 mr-2"/> Save & Continue</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ----------------------------------------------
// Order Form
// ----------------------------------------------
function OrderForm({ user, onRequireAuth, onSubmit }){
  const [wasteType, setWasteType] = useState("newspaper");
  const [quantity, setQuantity] = useState("1"); // in kg approx
  const [seed, setSeed] = useState(SEEDS[0].id);
  const [pods, setPods] = useState(10);
  const [express, setExpress] = useState(false);
  const [notes, setNotes] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [paid, setPaid] = useState(false);

  const estimate = useMemo(()=>{
    const sub = BASE_PRICE + pods * POD_PRICE + (express?EXPRESS_FEE:0);
    return { sub, total: sub };
  }, [pods, express]);

  useEffect(()=>{
    if(!user) onRequireAuth?.();
  }, []);

  const handlePay = () => {
    // Mock payment (Razorpay/UPI placeholder)
    setTimeout(()=>{
      setPaid(true);
      alert("Payment successful (demo)");
    }, 300);
  };

  const placeOrder = () => {
    if(!user) return onRequireAuth?.();
    if(!pickupDate) return alert("Please choose a pickup date");
    const id = "ORD-" + Math.random().toString(36).slice(2,8).toUpperCase();
    const now = new Date().toISOString();
    const order = {
      id,
      createdAt: now,
      user,
      wasteType,
      quantity: Number(quantity),
      seed,
      pods: Number(pods),
      express,
      notes,
      pickupDate,
      amount: estimate.total,
      paid,
      status: "placed",
      timeline: [{ key: "placed", at: now }],
    };
    onSubmit?.(order);
    // add points
    try {
      const u = readLS(LS_KEYS.USER, user);
      const bonus = Math.max(1, Math.floor(Number(quantity))) + (paid?5:0);
      u.points = (u.points || 0) + bonus;
      saveLS(LS_KEYS.USER, u);
    } catch {}
    // reset
    setNotes("");
    setPods(10);
    setPaid(false);
    alert("Order placed! You can track it in My Orders.");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl">Request Pods & Waste Pickup</CardTitle>
            <CardDescription>Upload your interest, choose seeds, schedule pickup, pay the fee.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Waste Type</Label>
                <Select value={wasteType} onValueChange={setWasteType}>
                  <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Choose"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newspaper">📰 Newspaper / Magazines</SelectItem>
                    <SelectItem value="eggshells">🥚 Egg shells (clean & dry)</SelectItem>
                    <SelectItem value="cardboard">📦 Cardboard / Notebook pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Approx Quantity (kg)</Label>
                <Input type="number" min={0.5} step={0.5} value={quantity} onChange={e=>setQuantity(e.target.value)} className="rounded-2xl"/>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Seeds</Label>
                <Select value={seed} onValueChange={setSeed}>
                  <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SEEDS.map(s=> <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Number of Pods</Label>
                <Input type="number" min={5} step={5} value={pods} onChange={e=>setPods(e.target.value)} className="rounded-2xl"/>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 items-end">
              <div>
                <Label>Pickup Date</Label>
                <Input type="date" value={pickupDate} onChange={e=>setPickupDate(e.target.value)} className="rounded-2xl"/>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-2xl">
                <div className="text-sm">
                  <div className="font-medium flex items-center gap-2"><Clock className="w-4 h-4"/> Express Delivery</div>
                  <div className="text-xs text-slate-500">24–48h after pickup (+{fmtINR(EXPRESS_FEE)})</div>
                </div>
                <Switch checked={express} onCheckedChange={setExpress}/>
              </div>
            </div>

            <div>
              <Label>Notes (optional)</Label>
              <Textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any special instructions, preferred time window, apartment gate pass, etc."/>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="rounded-3xl sticky top-24">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><Wallet className="w-5 h-5"/> Payment</CardTitle>
            <CardDescription>Base + per-pod pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PriceRow label="Base Service" value={fmtINR(BASE_PRICE)} />
            <PriceRow label={`Pods x ${pods}`} value={fmtINR(POD_PRICE * pods)} />
            {express && <PriceRow label="Express" value={fmtINR(EXPRESS_FEE)} />}
            <div className="border-t pt-2 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4"/>{estimate.total}</span>
            </div>
            <div className="flex gap-2">
              <Button className="rounded-2xl flex-1" variant={paid?"secondary":"default"} onClick={handlePay} disabled={paid}><DollarSign className="w-4 h-4 mr-2"/>{paid?"Paid":"Pay (Demo)"}</Button>
              <Button className="rounded-2xl flex-1" onClick={placeOrder} disabled={!paid}><CheckCircle2 className="w-4 h-4 mr-2"/>Place Order</Button>
            </div>
            <div className="text-xs text-slate-500">Demo checkout only. Hook up Razorpay/UPI in production.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PriceRow({ label, value }){
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

// ----------------------------------------------
// My Orders
// ----------------------------------------------
function MyOrders({ orders }){
  if(!orders?.length) return (
    <EmptyState title="No orders yet" subtitle="Place your first pickup+pods request to see it here." actionLabel="Request Pods"/>
  );
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map(o => <OrderCard key={o.id} order={o}/>) }
    </div>
  );
}

function OrderCard({ order }){
  const currentIndex = STATUS_STEPS.findIndex(s => s.key === order.status);
  const progress = Math.round(((currentIndex+1) / STATUS_STEPS.length) * 100);
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Package className="w-4 h-4"/> {order.id}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <MapPin className="w-3 h-3"/> {order.user?.address?.slice(0,64) || "—"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <Info label="Waste" value={order.wasteType} />
          <Info label="Quantity" value={`${order.quantity} kg`} />
          <Info label="Seed" value={SEEDS.find(s=>s.id===order.seed)?.name || order.seed} />
          <Info label="Pods" value={order.pods} />
          <Info label="Pickup" value={order.pickupDate} />
          <Info label="Amount" value={fmtINR(order.amount)} />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> {STATUS_STEPS[currentIndex]?.label}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }){
  return (
    <div className="p-2 border rounded-2xl">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function EmptyState({ title, subtitle, actionLabel }){
  const [app, setApp] = useState(null);
  useEffect(()=> setApp(document.querySelector("#root") ? "app" : ""), []);
  return (
    <Card className="rounded-3xl">
      <CardContent className="p-8 text-center">
        <Sprout className="w-10 h-10 mx-auto mb-2 text-emerald-600"/>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-slate-500">{subtitle}</div>
        {actionLabel && <div className="mt-4"><Button className="rounded-2xl">{actionLabel}</Button></div>}
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------
// Admin Panel
// ----------------------------------------------
function AdminPanel({ adminMode, setAdminMode, orders, setOrders, setUser }) {
  const [pin, setPin] = useState("");
  const [seedFilter, setSeedFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Always run hooks
  const filtered = useMemo(() =>
    orders.filter(o =>
      (seedFilter === "all" || o.seed === seedFilter) &&
      (statusFilter === "all" || o.status === statusFilter)
    ), [orders, seedFilter, statusFilter]
  );

  const totals = useMemo(() => {
    const pods = orders.reduce((a, b) => a + Number(b.pods || 0), 0);
    const revenue = orders.reduce((a, b) => a + Number(b.amount || 0), 0);
    const pickups = orders.length;
    return { pods, revenue, pickups };
  }, [orders]);

  const updateStatus = (id, status) => {
    setOrders(orders.map(o =>
      o.id === id
        ? { ...o, status, timeline: [...o.timeline, { key: status, at: new Date().toISOString() }] }
        : o
    ));
  };

  const deleteOrder = (id) => {
    if (confirm("Delete this order?")) setOrders(orders.filter(o => o.id !== id));
  };

  // 🔑 Conditional rendering is now AFTER all hooks
  if (!adminMode) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" /> Admin Access
            </CardTitle>
            <CardDescription>Enter PIN to manage orders (demo PIN: 1234)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="rounded-2xl"
            />
            <Button
              className="rounded-2xl"
              onClick={() => {
                if (pin === "1234") setAdminMode(true);
                else alert("Wrong PIN");
              }}
            >
              Unlock
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Admin Dashboard view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Admin Dashboard</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => { setAdminMode(false); setUser(null); }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Exit
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Metric title="Total Pods" value={totals.pods} icon={<Sprout className="w-5 h-5" />} />
        <Metric title="Revenue" value={fmtINR(totals.revenue)} icon={<IndianRupee className="w-5 h-5" />} />
        <Metric title="Pickups" value={totals.pickups} icon={<Truck className="w-5 h-5" />} />
      </div>

      {/* Orders Management */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Orders</CardTitle>
          <CardDescription>Filter and update order statuses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <Label>Seed</Label>
              <Select value={seedFilter} onValueChange={setSeedFilter}>
                <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {SEEDS.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {STATUS_STEPS.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Order</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Seed</th>
                  <th className="py-2">Pods</th>
                  <th className="py-2">Pickup</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{o.id}</td>
                    <td className="py-2">
                      {o.user?.name}
                      <div className="text-xs text-slate-500">{o.user?.phone}</div>
                    </td>
                    <td className="py-2">{SEEDS.find(s => s.id === o.seed)?.name}</td>
                    <td className="py-2">{o.pods}</td>
                    <td className="py-2">{o.pickupDate}</td>
                    <td className="py-2">
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                        <SelectTrigger className="rounded-xl h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_STEPS.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2">{fmtINR(o.amount)}</td>
                    <td className="py-2 text-right">
                      <Button variant="ghost" size="sm" onClick={() => deleteOrder(o.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Script */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Pickup Script (for Agents)</CardTitle>
          <CardDescription>Use this quick checklist when visiting homes</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <ul className="list-disc pl-5 space-y-1">
            <li>Confirm waste type & approx quantity</li>
            <li>Ensure egg shells are clean & dry (no smell)</li>
            <li>Pack separately (paper vs shells)</li>
            <li>Share expected delivery date (standard or express)</li>
            <li>Say thank you & award Eco-Points</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


function Metric({ title, value, icon }){
  return (
    <Card className="rounded-3xl">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">{icon}</div>
          <div>
            <div className="text-xs text-slate-500">{title}</div>
            <div className="text-lg font-semibold">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
