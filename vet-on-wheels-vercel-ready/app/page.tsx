'use client';

import { useMemo, useState } from 'react';

type View = 'home' | 'pets' | 'visits' | 'plans' | 'records' | 'track' | 'book' | 'triage';
type Pet = { id: number; name: string; breed: string; age: string; weight: string; icon: string; next: string };
type Service = { id: string; icon: string; name: string; price: number; duration: string; detail: string };

const services: Service[] = [
  { id: 'checkup', icon: '✚', name: 'General checkup', price: 500, duration: '30 min', detail: 'Nose-to-tail health assessment' },
  { id: 'vaccine', icon: '◇', name: 'Vaccination', price: 650, duration: '25 min', detail: 'Core and booster vaccinations' },
  { id: 'minor', icon: '⌁', name: 'Minor treatment', price: 800, duration: '40 min', detail: 'Skin, ear, eye and wound care' },
  { id: 'diagnostics', icon: '◉', name: 'Diagnostics', price: 950, duration: '45 min', detail: 'Portable tests and sample collection' },
];
const slots = ['9:00 AM', '11:30 AM', '2:00 PM', '5:30 PM'];
const navItems: { id: View; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' }, { id: 'pets', label: 'My pets', icon: '♡' },
  { id: 'visits', label: 'Visits', icon: '▣' }, { id: 'plans', label: 'Wellness', icon: '✦' },
  { id: 'records', label: 'Records', icon: '▤' },
];

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [pets, setPets] = useState<Pet[]>([
    { id: 1, name: 'Milo', breed: 'Golden Retriever', age: '4 years', weight: '28.4 kg', icon: 'M', next: 'Rabies booster • 12 Sep' },
    { id: 2, name: 'Luna', breed: 'Indie cat', age: '2 years', weight: '4.1 kg', icon: 'L', next: 'Annual exam • 04 Oct' },
  ]);
  const [activePet, setActivePet] = useState(1);
  const [service, setService] = useState('checkup');
  const [slot, setSlot] = useState('11:30 AM');
  const [bookStep, setBookStep] = useState(1);
  const [bookingStatus, setBookingStatus] = useState<'upcoming' | 'rescheduled' | 'cancelled'>('upcoming');
  const [plan, setPlan] = useState('essential');
  const [subscribed, setSubscribed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profilePanel, setProfilePanel] = useState<'account' | 'addresses' | 'payment' | 'help' | null>(null);
  const [paymentStep, setPaymentStep] = useState<'methods' | 'checkout' | 'success'>('methods');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showAddPet, setShowAddPet] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const [toast, setToast] = useState('');
  const [triageSymptoms, setTriageSymptoms] = useState<string[]>([]);
  const [triageDone, setTriageDone] = useState(false);
  const [trackerStep, setTrackerStep] = useState(2);

  const selectedService = useMemo(() => services.find((x) => x.id === service) ?? services[0], [service]);
  const selectedPet = pets.find((x) => x.id === activePet) ?? pets[0];
  const total = selectedService.price + 300;

  function go(next: View) { setView(next); setShowProfile(false); setShowNotices(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function startBooking(chosen?: string) { if (chosen) setService(chosen); setBookStep(1); go('book'); }
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2600); }
  function openProfilePanel(panel: 'account' | 'addresses' | 'payment' | 'help') {
    setShowProfile(false); setProfilePanel(panel);
    if (panel === 'payment') setPaymentStep('methods');
  }
  function addPet(form: FormData) {
    const name = String(form.get('name') || 'New pet');
    setPets([...pets, { id: Date.now(), name, breed: String(form.get('breed') || 'Pet'), age: String(form.get('age') || 'Age not set'), weight: 'Weight not set', icon: name[0].toUpperCase(), next: 'No reminders yet' }]);
    setShowAddPet(false); notify(`${name} was added to your family`);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <button className="brand" onClick={() => go('home')} aria-label="Vet on Wheels home"><span className="brand-mark">V+</span><span>VET ON WHEELS</span></button>
        <div className="header-location"><span>⌖</span><div><small>Serving</small><strong>Banjara Hills, Hyderabad</strong></div><button aria-label="Change address">⌄</button></div>
        <div className="header-actions">
          <button className="round-action" onClick={() => setShowNotices(!showNotices)} aria-label="Notifications">♢<i>3</i></button>
          <button className="user-chip" onClick={() => setShowProfile(!showProfile)}><span>UR</span><div><strong>Uday Reddy</strong><small>Pet parent</small></div><b>⌄</b></button>
        </div>
        {showNotices && <div className="popover notices"><h3>Notifications <span>3 new</span></h3>
          <button onClick={() => go('visits')}><i className="notice-dot"/><span><strong>Visit tomorrow</strong><small>Dr. Ananya arrives at 11:30 AM</small></span></button>
          <button onClick={() => go('records')}><i/><span><strong>Report available</strong><small>Milo’s blood panel is ready</small></span></button>
          <button onClick={() => go('plans')}><i/><span><strong>Vaccination reminder</strong><small>Luna’s annual booster is due soon</small></span></button>
        </div>}
        {showProfile && <div className="popover profile-menu"><div className="profile-summary"><span>UR</span><div><strong>Uday Reddy</strong><small>uday@example.com</small></div></div>
          <button onClick={() => openProfilePanel('account')}>⚙ Account settings</button><button onClick={() => openProfilePanel('addresses')}>⌖ Saved addresses</button><button onClick={() => openProfilePanel('payment')}>▰ Payment methods</button><button onClick={() => openProfilePanel('help')}>? Help & support</button><button className="signout" onClick={() => notify('Demo account stays signed in')}>↪ Sign out</button>
        </div>}
      </header>

      <div className="app-grid">
        <aside className="sidebar">
          <nav>{navItems.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => go(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
          <div className="sidebar-help"><span>24/7</span><strong>Need urgent help?</strong><p>We’ll help you find the right level of care.</p><button onClick={() => go('triage')}>Check symptoms →</button></div>
          <small className="prototype-label">CUSTOMER APP • PROTOTYPE</small>
        </aside>

        <section className="main-content">
          {view === 'home' && <Dashboard pets={pets} selectedPet={selectedPet} setActivePet={setActivePet} startBooking={startBooking} go={go} bookingStatus={bookingStatus} />}
          {view === 'pets' && <PetsPage pets={pets} activePet={activePet} setActivePet={setActivePet} onAdd={() => setShowAddPet(true)} startBooking={startBooking} notify={notify} />}
          {view === 'visits' && <VisitsPage status={bookingStatus} setStatus={setBookingStatus} go={go} startBooking={startBooking} notify={notify} />}
          {view === 'plans' && <PlansPage plan={plan} setPlan={setPlan} subscribed={subscribed} setSubscribed={setSubscribed} notify={notify} />}
          {view === 'records' && <RecordsPage notify={notify} />}
          {view === 'book' && <BookingFlow step={bookStep} setStep={setBookStep} services={services} service={service} setService={setService} pets={pets} activePet={activePet} setActivePet={setActivePet} slot={slot} setSlot={setSlot} total={total} selectedService={selectedService} go={go} notify={notify} />}
          {view === 'track' && <Tracker trackerStep={trackerStep} setTrackerStep={setTrackerStep} notify={notify} go={go} />}
          {view === 'triage' && <Triage symptoms={triageSymptoms} setSymptoms={setTriageSymptoms} done={triageDone} setDone={setTriageDone} startBooking={startBooking} />}
        </section>
      </div>

      {profilePanel && <div className="modal-backdrop" onMouseDown={() => setProfilePanel(null)}><section className="modal profile-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={() => setProfilePanel(null)}>×</button>
        {profilePanel === 'account' && <form onSubmit={(e) => { e.preventDefault(); setProfilePanel(null); notify('Account changes saved'); }}>
          <span className="kicker">ACCOUNT SETTINGS</span><h2>Your details.</h2><p className="modal-copy">Keep your contact information current for visit updates and receipts.</p>
          <div className="account-avatar"><span>UR</span><div><strong>Uday Reddy</strong><small>Customer since August 2026</small></div><button type="button" onClick={() => notify('Profile photo chooser opened')}>Change photo</button></div>
          <div className="form-two"><label>Full name<input defaultValue="Uday Reddy" /></label><label>Mobile number<input defaultValue="+91 98••• ••210" /></label></div>
          <label>Email address<input defaultValue="uday@example.com" type="email" /></label><label>Preferred language<select defaultValue="English"><option>English</option><option>తెలుగు</option><option>हिन्दी</option></select></label>
          <label className="toggle-row"><input type="checkbox" defaultChecked/><span><strong>Visit reminders</strong><small>Receive appointment and care updates</small></span></label>
          <div className="modal-actions"><button type="button" className="secondary" onClick={() => setProfilePanel(null)}>Cancel</button><button className="primary" type="submit">Save changes <span>→</span></button></div>
        </form>}
        {profilePanel === 'addresses' && <div>
          <span className="kicker">SAVED ADDRESSES</span><h2>Where we visit.</h2><p className="modal-copy">Choose a default address or add another Hyderabad location.</p>
          <div className="address-list"><button className="selected"><span>⌂</span><div><strong>Home <i>DEFAULT</i></strong><p>Road No. 12, Banjara Hills<br/>Apartment 402 • Call at gate</p></div><b>✓</b></button><button onClick={() => notify('Office set as the visit address')}><span>▥</span><div><strong>Office</strong><p>Knowledge City, Raidurg<br/>Tower 2 • Reception desk</p></div><b>›</b></button></div>
          <button className="add-address" onClick={() => notify('New address form opened')}>+ Add another address</button>
          <div className="modal-actions"><button className="secondary" onClick={() => setProfilePanel(null)}>Close</button><button className="primary" onClick={() => { setProfilePanel(null); notify('Default address saved'); }}>Save default <span>→</span></button></div>
        </div>}
        {profilePanel === 'payment' && <div>
          {paymentStep === 'methods' && <><span className="kicker">PAYMENTS</span><h2>Payment methods.</h2><p className="modal-copy">Manage demo payment methods and settle the upcoming visit estimate.</p>
            <div className="demo-banner"><span>i</span><div><strong>Simulation only</strong><small>No real money or payment details are processed.</small></div></div>
            <div className="due-card"><div><small>UPCOMING VISIT • VOW-2048</small><strong>Estimated amount due</strong><span>Pay now or after the visit</span></div><b>₹800</b></div>
            <div className="saved-methods"><h3>Saved methods</h3><div><span className="pay-logo">UPI</span><div><strong>uday.demo@upi</strong><small>Primary payment method</small></div><i>✓</i></div><div><span className="pay-logo card-logo">VISA</span><div><strong>•••• 4242</strong><small>Expires 08/29 • Demo card</small></div><button onClick={() => notify('Demo card removed')}>Remove</button></div></div>
            <button className="primary wide" onClick={() => setPaymentStep('checkout')}>Pay ₹800 now <span>→</span></button><button className="secondary wide" onClick={() => notify('Add payment method opened')}>+ Add payment method</button>
          </>}
          {paymentStep === 'checkout' && <><button className="inline-back" onClick={() => setPaymentStep('methods')}>← Payment methods</button><span className="kicker">SECURE CHECKOUT • DEMO</span><h2>Pay ₹800.</h2>
            <div className="payment-method-tabs"><button className={paymentMethod === 'upi' ? 'active' : ''} onClick={() => setPaymentMethod('upi')}>UPI</button><button className={paymentMethod === 'card' ? 'active' : ''} onClick={() => setPaymentMethod('card')}>Card</button><button className={paymentMethod === 'cash' ? 'active' : ''} onClick={() => setPaymentMethod('cash')}>Pay after visit</button></div>
            {paymentMethod === 'upi' && <div className="payment-form"><label>UPI ID<input defaultValue="uday.demo@upi" /></label><p>We’ll simulate a payment request to this UPI ID.</p></div>}
            {paymentMethod === 'card' && <div className="payment-form"><label>Card number<input defaultValue="4242 4242 4242 4242" inputMode="numeric" /></label><div className="form-two"><label>Expiry<input defaultValue="08/29" /></label><label>CVV<input defaultValue="123" /></label></div><p>Demo card values only. Nothing is transmitted or stored.</p></div>}
            {paymentMethod === 'cash' && <div className="pay-later"><span>⌂</span><div><strong>Pay after the visit</strong><p>Use UPI, card or cash with the care team after treatment is complete.</p></div></div>}
            <div className="payment-breakdown"><div><span>General wellness check</span><b>₹500</b></div><div><span>Home visit fee</span><b>₹300</b></div><div><strong>Total</strong><strong>₹800</strong></div></div>
            <button className="primary wide" onClick={() => setPaymentStep('success')}>{paymentMethod === 'cash' ? 'Confirm pay after visit' : 'Simulate payment ₹800'} <span>→</span></button><small className="safe-payment">🔒 Demo checkout—no financial transaction will occur.</small>
          </>}
          {paymentStep === 'success' && <div className="payment-success"><span>✓</span><small>{paymentMethod === 'cash' ? 'PAYMENT OPTION SAVED' : 'DEMO PAYMENT SUCCESSFUL'}</small><h2>{paymentMethod === 'cash' ? 'Pay after your visit.' : 'Payment simulated.'}</h2><p>{paymentMethod === 'cash' ? 'The care team will collect ₹800 when the visit is complete.' : 'A sample receipt has been created for booking VOW-2048. No money was charged.'}</p><div className="receipt"><div><span>Booking</span><strong>VOW-2048</strong></div><div><span>Amount</span><strong>₹800</strong></div><div><span>Status</span><strong>{paymentMethod === 'cash' ? 'DUE AFTER VISIT' : 'DEMO PAID'}</strong></div></div><button className="primary wide" onClick={() => { setProfilePanel(null); notify('Payment simulation complete'); }}>Done <span>→</span></button><button className="secondary wide" onClick={() => notify('Demo receipt downloaded')}>Download sample receipt</button></div>}
        </div>}
        {profilePanel === 'help' && <div>
          <span className="kicker">HELP & SUPPORT</span><h2>How can we help?</h2><p className="modal-copy">Find quick answers or start a simulated conversation with the care team.</p>
          <label className="help-search">⌕<input placeholder="Search bookings, payments or pet care…" /></label>
          <div className="support-options"><button onClick={() => notify('Support chat started')}><span>◌</span><div><strong>Chat with support</strong><small>Typical reply in under 2 minutes</small></div><b>→</b></button><button onClick={() => notify('Callback requested for the demo')}><span>☎</span><div><strong>Request a callback</strong><small>Available 8 AM–10 PM daily</small></div><b>→</b></button><button onClick={() => { setProfilePanel(null); go('triage'); }}><span>!</span><div><strong>Urgent care guidance</strong><small>Check symptoms and emergency signs</small></div><b>→</b></button></div>
          <div className="faq-list"><h3>Frequently asked</h3><details><summary>How do I reschedule a visit?</summary><p>Open Visits, choose the upcoming booking and select Reschedule.</p></details><details><summary>When do I pay?</summary><p>You may pay securely in the app or after the visit. This prototype only simulates payments.</p></details><details><summary>What can the mobile clinic treat?</summary><p>Routine checkups, vaccinations, minor treatment and portable diagnostics. Emergencies need a hospital.</p></details></div>
          <button className="secondary wide" onClick={() => setProfilePanel(null)}>Close help</button>
        </div>}
      </section></div>}

      {showAddPet && <div className="modal-backdrop" onMouseDown={() => setShowAddPet(false)}><form className="modal" onMouseDown={(e) => e.stopPropagation()} action={addPet}>
        <button type="button" className="modal-close" onClick={() => setShowAddPet(false)}>×</button><span className="kicker">NEW PET PROFILE</span><h2>Tell us about your pet.</h2>
        <label>Pet’s name<input name="name" required placeholder="e.g. Coco" /></label><label>Species<select name="species"><option>Dog</option><option>Cat</option><option>Other</option></select></label>
        <label>Breed<input name="breed" placeholder="e.g. Beagle" /></label><label>Age<input name="age" placeholder="e.g. 3 years" /></label><button className="primary" type="submit">Add pet <span>→</span></button>
      </form></div>}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </main>
  );
}

function PageTitle({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: React.ReactNode }) {
  return <div className="page-title"><div><span className="kicker">{eyebrow}</span><h1>{title}</h1>{copy && <p>{copy}</p>}</div>{action}</div>;
}

function Dashboard({ pets, selectedPet, setActivePet, startBooking, go, bookingStatus }: { pets: Pet[]; selectedPet: Pet; setActivePet: (id:number)=>void; startBooking:(s?:string)=>void; go:(v:View)=>void; bookingStatus:string }) {
  return <>
    <PageTitle eyebrow="THURSDAY, 27 AUGUST" title="Good evening, Uday." copy="Here’s what’s happening with your pets." action={<button className="primary" onClick={() => startBooking()}>Book a home visit <span>→</span></button>} />
    {bookingStatus !== 'cancelled' && <section className="next-visit-card"><div className="visit-date"><small>AUG</small><strong>{bookingStatus === 'rescheduled' ? '29' : '28'}</strong><span>{bookingStatus === 'rescheduled' ? 'SAT' : 'FRI'}</span></div><div className="visit-main"><span className="status-pill"><i/> {bookingStatus === 'rescheduled' ? 'RESCHEDULED' : 'UPCOMING VISIT'}</span><h2>General wellness check</h2><p>{selectedPet.name} • {bookingStatus === 'rescheduled' ? '2:00 PM' : '11:30 AM'}–12:00 PM • At home</p><div className="assigned-vet"><span>AK</span><div><strong>Dr. Ananya K.</strong><small>Veterinarian • 4.9 ★</small></div></div></div><div className="visit-actions"><button className="primary" onClick={() => go('track')}>Track visit <span>→</span></button><button className="secondary" onClick={() => go('visits')}>Manage booking</button></div></section>}
    <div className="dashboard-grid">
      <section className="panel quick-panel"><div className="panel-head"><div><span className="kicker">QUICK ACTIONS</span><h2>How can we help?</h2></div></div><div className="quick-grid">
        <button onClick={() => startBooking('checkup')}><span>✚</span><strong>Book a visit</strong><small>Routine care at home</small></button><button onClick={() => go('triage')}><span>⌁</span><strong>Check symptoms</strong><small>Decide the next step</small></button><button onClick={() => go('records')}><span>▤</span><strong>View records</strong><small>Reports & prescriptions</small></button><button onClick={() => go('plans')}><span>✦</span><strong>Wellness plan</strong><small>Save on routine care</small></button>
      </div></section>
      <section className="panel pets-panel"><div className="panel-head"><div><span className="kicker">MY PETS</span><h2>Your family</h2></div><button onClick={() => go('pets')}>View all →</button></div>{pets.map((pet) => <button className={`pet-row ${pet.id === selectedPet.id ? 'selected' : ''}`} key={pet.id} onClick={() => setActivePet(pet.id)}><span className="pet-avatar">{pet.icon}</span><div><strong>{pet.name}</strong><small>{pet.breed} • {pet.age}</small></div><i>{pet.id === selectedPet.id ? '✓' : '›'}</i></button>)}</section>
    </div>
    <section className="panel care-reminders"><div className="panel-head"><div><span className="kicker">CARE REMINDERS</span><h2>Keep them on track.</h2></div><button onClick={() => go('records')}>Health timeline →</button></div><div className="reminder-grid"><div><span className="reminder-icon amber">♢</span><div><small>DUE IN 16 DAYS</small><strong>Milo’s rabies booster</strong><p>Recommended by 12 September</p></div><button onClick={() => startBooking('vaccine')}>Book</button></div><div><span className="reminder-icon mint">✦</span><div><small>DUE IN 5 WEEKS</small><strong>Luna’s annual exam</strong><p>Routine check and weight review</p></div><button onClick={() => startBooking('checkup')}>Book</button></div></div></section>
  </>;
}

function PetsPage({ pets, activePet, setActivePet, onAdd, startBooking, notify }: { pets:Pet[]; activePet:number; setActivePet:(id:number)=>void; onAdd:()=>void; startBooking:(s?:string)=>void; notify:(s:string)=>void }) {
  const pet = pets.find((x)=>x.id===activePet) ?? pets[0];
  return <><PageTitle eyebrow="PET PROFILES" title="My pets." copy="Health details, reminders and care history in one place." action={<button className="primary" onClick={onAdd}>+ Add a pet</button>} />
    <div className="pet-profile-layout"><aside className="pet-switcher">{pets.map((x)=><button key={x.id} className={x.id===activePet?'active':''} onClick={()=>setActivePet(x.id)}><span>{x.icon}</span><div><strong>{x.name}</strong><small>{x.breed}</small></div><i>›</i></button>)}</aside>
      <div className="pet-detail"><section className="pet-hero"><span className="large-pet-avatar">{pet.icon}</span><div><span className="status-pill healthy"><i/> HEALTH PROFILE ACTIVE</span><h2>{pet.name}</h2><p>{pet.breed} • {pet.age} • {pet.weight}</p></div><button className="secondary" onClick={()=>notify('Pet details are ready to edit')}>Edit profile</button></section>
        <div className="metric-strip"><div><small>WEIGHT</small><strong>{pet.weight}</strong><span>Stable</span></div><div><small>LAST VISIT</small><strong>18 Jul 2026</strong><span>Wellness exam</span></div><div><small>NEXT DUE</small><strong>12 Sep 2026</strong><span>Rabies booster</span></div></div>
        <section className="panel"><div className="panel-head"><div><span className="kicker">HEALTH DETAILS</span><h2>Care at a glance</h2></div></div><div className="detail-list"><div><span>♢</span><div><strong>Vaccinations</strong><small>Core vaccines current • Booster due soon</small></div><button onClick={()=>startBooking('vaccine')}>Book booster</button></div><div><span>⚑</span><div><strong>Allergies</strong><small>No known allergies recorded</small></div><button onClick={()=>notify('Allergy editor opened')}>Update</button></div><div><span>▤</span><div><strong>Medication</strong><small>No active medication</small></div><button onClick={()=>notify('Medication list opened')}>View history</button></div></div></section>
      </div></div></>;
}

function VisitsPage({ status, setStatus, go, startBooking, notify }: { status:string; setStatus:(s:'upcoming'|'rescheduled'|'cancelled')=>void; go:(v:View)=>void; startBooking:(s?:string)=>void; notify:(s:string)=>void }) {
  return <><PageTitle eyebrow="APPOINTMENTS" title="Visits." copy="Manage upcoming care and review completed visits." action={<button className="primary" onClick={()=>startBooking()}>+ Book new visit</button>} />
    <div className="tabs"><button className="active">Upcoming</button><button>Past visits</button><button>Cancelled</button></div>
    {status==='cancelled'?<div className="empty-state"><span>▣</span><h2>No upcoming visits</h2><p>Book routine care whenever your pet needs it.</p><button className="primary" onClick={()=>startBooking()}>Book a visit</button></div>:<section className="appointment-card"><div className="appointment-top"><div><span className="status-pill"><i/> {status==='rescheduled'?'RESCHEDULED':'CONFIRMED'}</span><h2>General wellness check</h2><p>Milo • Friday, {status==='rescheduled'?'29':'28'} August • {status==='rescheduled'?'2:00':'11:30'} AM</p></div><strong className="appointment-price">₹800<small>Pay after visit</small></strong></div><div className="appointment-body"><div><small>VISIT ADDRESS</small><strong>Road No. 12, Banjara Hills</strong><span>Apartment 402 • Call at gate</span></div><div><small>ASSIGNED TEAM</small><strong>Dr. Ananya K. + vet-tech</strong><span>EV Clinic VOW-03</span></div><div><small>BOOKING ID</small><strong>VOW-2048</strong><span>Created 26 Aug</span></div></div><div className="appointment-actions"><button className="primary" onClick={()=>go('track')}>Track live <span>→</span></button><button className="secondary" onClick={()=>{setStatus('rescheduled');notify('Visit moved to Saturday at 2:00 PM')}}>Reschedule</button><button className="danger-link" onClick={()=>{setStatus('cancelled');notify('Visit cancelled')}}>Cancel visit</button></div></section>}
    <section className="panel past-visits"><div className="panel-head"><div><span className="kicker">PAST VISITS</span><h2>Recent care</h2></div></div><div className="visit-history-row"><span className="history-date">18<small>JUL</small></span><div><strong>Annual wellness exam</strong><small>Milo • Dr. Rahul M.</small></div><span className="paid">PAID ₹1,150</span><button onClick={()=>notify('Visit summary downloaded')}>View summary →</button></div><div className="visit-history-row"><span className="history-date">03<small>MAR</small></span><div><strong>Vaccination appointment</strong><small>Luna • Dr. Ananya K.</small></div><span className="paid">PAID ₹950</span><button onClick={()=>notify('Visit summary downloaded')}>View summary →</button></div></section>
  </>;
}

function PlansPage({ plan, setPlan, subscribed, setSubscribed, notify }: { plan:string; setPlan:(s:string)=>void; subscribed:boolean; setSubscribed:(v:boolean)=>void; notify:(s:string)=>void }) {
  const plans=[{id:'essential',name:'Essential',price:'₹499',desc:'Routine prevention for one pet',features:['2 home checkups / year','Vaccination reminders','10% off diagnostics','Priority booking']},{id:'complete',name:'Complete care',price:'₹899',desc:'More support for every stage',features:['4 home checkups / year','Core vaccinations included','15% off diagnostics','Priority booking + chat']},{id:'family',name:'Pet family',price:'₹1,299',desc:'Complete care for up to 3 pets',features:['6 shared home checkups','Core vaccinations included','20% off diagnostics','Priority booking + chat']}];
  return <><PageTitle eyebrow="WELLNESS MEMBERSHIP" title="Care that stays ahead." copy="Spread routine care across the year and save on every visit." />
    {subscribed&&<div className="membership-banner"><span>✦</span><div><strong>Your {plans.find(x=>x.id===plan)?.name} plan is active</strong><small>Next renewal: 27 September • Auto-pay via UPI</small></div><button onClick={()=>notify('Membership settings opened')}>Manage plan</button></div>}
    <div className="plan-grid">{plans.map((x)=><button key={x.id} className={`plan-card ${plan===x.id?'selected':''}`} onClick={()=>setPlan(x.id)}><span className="radio">{plan===x.id?'✓':''}</span><small>{x.id==='complete'?'MOST POPULAR':'MONTHLY PLAN'}</small><h2>{x.name}</h2><p>{x.desc}</p><strong>{x.price}<i>/month</i></strong><ul>{x.features.map(f=><li key={f}>✓ {f}</li>)}</ul></button>)}</div>
    <div className="plan-checkout"><div><small>SELECTED PLAN</small><strong>{plans.find(x=>x.id===plan)?.name} membership</strong><span>Cancel anytime • Taxes included</span></div><div><strong>{plans.find(x=>x.id===plan)?.price}<small>/ month</small></strong><button className="primary" onClick={()=>{setSubscribed(true);notify('Wellness membership activated')}}>{subscribed?'Plan active':'Start membership'} <span>→</span></button></div></div>
  </>;
}

function RecordsPage({ notify }: { notify:(s:string)=>void }) {
  const [filter,setFilter]=useState('All records');
  const records=[['18 Jul 2026','Wellness exam summary','Milo','Dr. Rahul M.','PDF'],['18 Jul 2026','Complete blood panel','Milo','VOW Diagnostics','LAB'],['03 Mar 2026','Vaccination certificate','Luna','Dr. Ananya K.','PDF'],['03 Mar 2026','Prescription — deworming','Luna','Dr. Ananya K.','RX']];
  return <><PageTitle eyebrow="HEALTH LIBRARY" title="Medical records." copy="Reports, prescriptions and vaccination certificates—always within reach." action={<button className="secondary" onClick={()=>notify('Records sharing link copied')}>Share records</button>} />
    <div className="record-filters">{['All records','Milo','Luna','Vaccinations','Lab reports'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}</button>)}</div>
    <section className="panel records-table"><div className="record-head"><span>DATE</span><span>DOCUMENT</span><span>PET</span><span>PROVIDER</span><span/></div>{records.filter(x=>filter==='All records'||filter===x[2]||(filter==='Vaccinations'&&x[1].includes('Vaccination'))||(filter==='Lab reports'&&x[4]==='LAB')).map((r)=><div className="record-row" key={r[0]+r[1]}><span>{r[0]}</span><span><i>{r[4]}</i><strong>{r[1]}</strong></span><span>{r[2]}</span><span>{r[3]}</span><button onClick={()=>notify(`${r[1]} downloaded`)}>↓ Download</button></div>)}</section>
    <div className="secure-note"><span>⌾</span><div><strong>Your records are private</strong><small>Only you and the clinical team assigned to your visit can access them. Sharing links expire automatically.</small></div></div>
  </>;
}

function BookingFlow({ step,setStep,services,service,setService,pets,activePet,setActivePet,slot,setSlot,total,selectedService,go,notify }: { step:number; setStep:(n:number)=>void; services:Service[]; service:string; setService:(s:string)=>void; pets:Pet[]; activePet:number; setActivePet:(n:number)=>void; slot:string; setSlot:(s:string)=>void; total:number; selectedService:Service; go:(v:View)=>void; notify:(s:string)=>void }) {
  const titles=['Choose your pet','What do they need?','Pick a time','Review and confirm'];
  return <><PageTitle eyebrow={`BOOK A HOME VISIT • STEP ${step} OF 4`} title={titles[step-1]} copy="A trained vet and vet-tech arrive in a fully equipped electric mobile clinic." action={<button className="secondary" onClick={()=>go('home')}>Save & exit</button>} />
    <div className="booking-layout"><div className="booking-main"><div className="booking-progress">{[1,2,3,4].map(n=><span className={n<=step?'done':''} key={n}><i>{n<step?'✓':n}</i><b>{['Pet','Care','Time','Confirm'][n-1]}</b></span>)}</div>
      {step===1&&<div className="choice-grid pet-choice">{pets.map(p=><button key={p.id} className={activePet===p.id?'selected':''} onClick={()=>setActivePet(p.id)}><span>{p.icon}</span><strong>{p.name}</strong><small>{p.breed}</small><i>{activePet===p.id?'✓':''}</i></button>)}</div>}
      {step===2&&<div className="choice-list">{services.map(s=><button key={s.id} className={service===s.id?'selected':''} onClick={()=>setService(s.id)}><span>{s.icon}</span><div><strong>{s.name}</strong><small>{s.detail} • {s.duration}</small></div><b>₹{s.price}</b><i>{service===s.id?'✓':''}</i></button>)}</div>}
      {step===3&&<div><div className="booking-date"><button>‹</button><div><small>TOMORROW</small><strong>Friday, 28 August</strong><span>4 mobile clinics available nearby</span></div><button>›</button></div><div className="slot-grid">{slots.map(s=><button key={s} className={slot===s?'selected':''} onClick={()=>setSlot(s)}>{s}<small>{s==='11:30 AM'?'Fastest arrival':'Available'}</small></button>)}</div></div>}
      {step===4&&<div className="review-card"><div><small>PET</small><strong>{pets.find(p=>p.id===activePet)?.name}</strong><button onClick={()=>setStep(1)}>Change</button></div><div><small>CARE</small><strong>{selectedService.name}</strong><button onClick={()=>setStep(2)}>Change</button></div><div><small>WHEN</small><strong>Tomorrow • {slot}</strong><button onClick={()=>setStep(3)}>Change</button></div><div><small>WHERE</small><strong>Road No. 12, Banjara Hills</strong><button onClick={()=>notify('Address selector opened')}>Change</button></div><label><input type="checkbox" defaultChecked/> Send updates by SMS and app notification</label></div>}
      <div className="booking-nav"><button className="secondary" disabled={step===1} onClick={()=>setStep(step-1)}>← Back</button><button className="primary" onClick={()=>{if(step<4)setStep(step+1);else{notify('Visit confirmed for tomorrow');go('visits')}}}>{step===4?'Confirm visit':'Continue'} <span>→</span></button></div>
    </div><aside className="booking-summary"><span className="kicker">YOUR VISIT</span><h3>At-home care</h3><div className="summary-pet"><span>{pets.find(p=>p.id===activePet)?.icon}</span><div><strong>{pets.find(p=>p.id===activePet)?.name}</strong><small>{pets.find(p=>p.id===activePet)?.breed}</small></div></div><dl><div><dt>{selectedService.name}</dt><dd>₹{selectedService.price}</dd></div><div><dt>Home visit fee</dt><dd>₹300</dd></div><div className="summary-total"><dt>Estimated total</dt><dd>₹{total}</dd></div></dl><p>Final price may change only if you approve additional treatment during the visit.</p><div className="trust-note">✓ Pay securely after your visit</div></aside></div>
  </>;
}

function Tracker({ trackerStep,setTrackerStep,notify,go }: { trackerStep:number; setTrackerStep:(n:number)=>void; notify:(s:string)=>void; go:(v:View)=>void }) {
  const stages=['Visit confirmed','Team dispatched','On the way','Arrived'];
  return <><PageTitle eyebrow="LIVE VISIT • VOW-2048" title={trackerStep<3?'Your vet is on the way.':'Your vet has arrived.'} copy="Live updates from EV Clinic VOW-03." action={<button className="secondary" onClick={()=>go('visits')}>Booking details</button>} />
    <div className="live-layout"><div className="map-panel large"><div className="map-grid"/><span className="road r1"/><span className="road r2"/><span className="road r3"/><div className="mini-truck" style={{left:`${36+trackerStep*6}%`}}>V+</div><div className="home-pin">⌂</div><div className="map-eta"><small>ESTIMATED ARRIVAL</small><strong>{trackerStep<3?`${12-trackerStep*3} min`:'Arrived'}</strong><span>Road No. 12, Banjara Hills</span></div></div>
      <aside className="track-card"><div className="eta"><strong>{trackerStep<3?12-trackerStep*3:'✓'}</strong><span>{trackerStep<3?'minutes away':'at your door'}</span></div><div className="vet-row"><div className="avatar">AK</div><div><strong>Dr. Ananya K.</strong><span>Veterinarian • 4.9 ★</span></div><button onClick={()=>notify('Calling the care team…')}>☎</button></div><ol className="timeline">{stages.map((s,i)=><li key={s} className={i<trackerStep?'complete':i===trackerStep?'current':''}><i>{i<trackerStep?'✓':i===trackerStep?'⚡':i+1}</i><span><strong>{s}</strong><small>{i<trackerStep?'Completed':i===trackerStep?'In progress':'Pending'}</small></span></li>)}</ol><button className="primary wide" disabled={trackerStep===3} onClick={()=>setTrackerStep(Math.min(3,trackerStep+1))}>{trackerStep===3?'Team has arrived':'Simulate next update'} <span>→</span></button><button className="secondary wide" onClick={()=>notify('Support chat opened')}>Message support</button></aside></div>
  </>;
}

function Triage({ symptoms,setSymptoms,done,setDone,startBooking }: { symptoms:string[]; setSymptoms:(s:string[])=>void; done:boolean; setDone:(v:boolean)=>void; startBooking:(s?:string)=>void }) {
  const options=['Vomiting','Not eating','Low energy','Skin or itching','Eye or ear issue','Limping','Coughing','Other'];
  return <><PageTitle eyebrow="SYMPTOM CHECKER" title="Help us understand what’s happening." copy="This quick check guides urgency—it does not diagnose your pet." />
    {!done?<div className="triage-layout"><section className="panel triage-form"><h2>What are you noticing?</h2><p>Select all that apply.</p><div className="symptom-grid">{options.map(x=><button key={x} className={symptoms.includes(x)?'selected':''} onClick={()=>setSymptoms(symptoms.includes(x)?symptoms.filter(s=>s!==x):[...symptoms,x])}>{symptoms.includes(x)?'✓':'+'} {x}</button>)}</div><label>How long has this been happening?<select><option>Less than 6 hours</option><option>6–24 hours</option><option>1–3 days</option><option>More than 3 days</option></select></label><label>Anything else we should know?<textarea placeholder="Describe changes in behaviour, appetite or medication…"/></label><button className="primary wide" disabled={!symptoms.length} onClick={()=>setDone(true)}>See recommended next step <span>→</span></button></section><aside className="emergency-card"><span>!</span><h3>Emergency signs</h3><p>Go to the nearest emergency hospital now for breathing difficulty, collapse, uncontrolled bleeding, seizures, poisoning, severe trauma, or inability to urinate.</p><button>Find emergency hospital →</button><small>Vet on Wheels is for routine and non-critical care.</small></aside></div>:
      <div className="triage-result"><span className="result-icon">✓</span><span className="kicker">RECOMMENDED NEXT STEP</span><h2>Book a vet visit within 24 hours.</h2><p>Based on what you selected, an at-home assessment is a reasonable next step. If symptoms suddenly worsen, seek emergency care immediately.</p><div><button className="primary" onClick={()=>startBooking('checkup')}>Book next available <span>→</span></button><button className="secondary" onClick={()=>setDone(false)}>Review answers</button></div><small>This guidance is not a medical diagnosis.</small></div>}
  </>;
}
