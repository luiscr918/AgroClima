
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { motion } from 'framer-motion';
import { Sun, CloudRain, Leaf } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function FeatureCard({ title, desc, icon: Icon, color }: { title: string; desc: string; icon: any; color?: string }) {
	return (
		<motion.article
			whileHover={{ translateY: -6 }}
			className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
			role="article"
			aria-labelledby={`feature-${title.replace(/\s+/g, '-')}`}
		>
			<div className="flex items-center gap-4 mb-3">
				<div className={`p-3 rounded-lg ${color ?? 'bg-green-50'}`}>
					<Icon className="w-7 h-7 text-current" />
				</div>
				<h3 id={`feature-${title.replace(/\s+/g, '-')}`} className="text-xl font-semibold text-green-800">{title}</h3>
			</div>
			<p className="text-sm text-gray-700">{desc}</p>
		</motion.article>
	);
}

export function HomePage() {
	const [location, setLocation] = useState('');
	const [stats] = useState([
 		{ label: 'Estaciones conectadas', value: '12' },
 		{ label: 'Alertas activas', value: '3' },
 		{ label: 'Usuarios', value: '1.2k' },
 		{ label: 'Regiones monitorizadas', value: '24' },
 	]);

	const [faqOpen, setFaqOpen] = useState<number | null>(null);

	function StatCard({ label, value }: { label: string; value: string }) {
		return (
			<div className="bg-white p-4 rounded-lg shadow-sm text-center">
				<div className="text-2xl font-bold text-green-800">{value}</div>
				<div className="text-sm text-gray-600">{label}</div>
			</div>
		);
	}

	function Testimonial({ quote, by }: { quote: string; by: string }) {
		return (
			<blockquote className="bg-white p-6 rounded-lg shadow-sm">
				<p className="text-gray-700">“{quote}”</p>
				<footer className="mt-3 text-sm text-gray-500">— {by}</footer>
			</blockquote>
		);
	}

	function FaqItem({ i, q, a }: { i: number; q: string; a: string }) {
		const open = faqOpen === i;
		return (
			<div className="border-b">
				<button
					className="w-full text-left py-3 flex items-center justify-between"
					onClick={() => setFaqOpen(open ? null : i)}
					aria-expanded={open}
				>
					<span className="font-medium text-green-800">{q}</span>
					<span className="text-green-600">{open ? '−' : '+'}</span>
				</button>
				{open && <div className="py-2 text-sm text-gray-700">{a}</div>}
			</div>
		);
	}
	return (
		<div className="min-h-screen flex flex-col bg-linear-to-b from-green-100 to-green-300 text-gray-800">
			<NavBar />

			<main className="grow">
				{/* HERO */}
				<section className="relative overflow-hidden">
					<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-60" aria-hidden="true" />
					<div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
						<div className="grid md:grid-cols-2 gap-8 items-center">
							<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
								<h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl leading-tight">AgroClima</h1>
								<p className="mt-4 max-w-xl text-lg text-white drop-shadow-md">Plataforma inteligente para ayudarte a adaptarte al cambio climático: clima, alertas y prácticas sostenibles en un solo lugar.</p>

								<div className="mt-6 flex flex-wrap gap-3">
									<Link to="/configurar-parcela" className="inline-flex items-center px-5 py-3 bg-green-800 text-white rounded-lg font-medium shadow hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300">Comenzar ahora</Link>
									<Link to="#features" className="inline-flex items-center px-4 py-3 border border-white/40 text-white rounded-lg hover:bg-white/10">Ver funciones</Link>
								</div>
							</motion.div>

							<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
								<div className="rounded-xl bg-white/80 p-6 shadow-lg">
									<div className="flex items-center justify-between">
										<div>
											<div className="text-sm text-gray-600">Última lectura</div>
											<div className="text-3xl font-bold">22°C</div>
											<div className="text-sm text-gray-600">Humedad 58% · Viento 12 km/h</div>
										</div>
										<div className="text-green-700 text-4xl">
											<Sun className="w-10 h-10" />
										</div>
									</div>
									<div className="mt-4 text-xs text-gray-600">Datos de ejemplo. Conecta tu estación meteorológica para datos en tiempo real.</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* QUICK SEARCH + STATS */}
				<section className="max-w-6xl mx-auto px-6 py-10">
					<div className="grid md:grid-cols-3 gap-6 items-start">
						<div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									alert(location ? `Buscando clima para ${location} (simulado)` : 'Introduce una ubicación');
								}}
								className="flex gap-2"
							>
								<input value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Buscar ubicación" placeholder="Buscar por ciudad o código postal" className="flex-1 rounded-md border border-gray-200 px-3 py-2" />
								<button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-md">Buscar</button>
							</form>
							<div className="mt-4 text-sm text-gray-600">Prueba: "Valencia", "Sevilla" o tu código postal.</div>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-1 gap-4">
							{stats.map((s) => (
								<StatCard key={s.label} label={s.label} value={s.value} />
							))}
						</div>
					</div>
				</section>

				{/* FEATURES */}
				<section id="features" className="max-w-6xl mx-auto px-6 py-16">
					<h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-10">¿Qué ofrece AgroClima?</h2>

					<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
						<FeatureCard
							title="Clima en Tiempo Real"
							desc="Datos actualizado sobre temperatura, humedad, viento y más, listos para tus decisiones diarias."
							icon={Sun}
							color="bg-yellow-50 text-yellow-600"
						/>

						<FeatureCard
							title="Alertas Meteorológicas"
							desc="Recibe notificaciones tempranas sobre eventos extremos para proteger tus cultivos y activos."
							icon={CloudRain}
							color="bg-blue-50 text-blue-600"
						/>

						<FeatureCard
							title="Prácticas Sostenibles"
							desc="Consejos y guías para adaptar técnicas agrícolas que reduzcan riesgos climáticos."
							icon={Leaf}
							color="bg-green-50 text-green-600"
						/>
					</div>

					<div className="mt-10 flex justify-center">
						<button className="px-6 py-3 bg-green-700 text-white rounded-lg shadow hover:bg-green-800">Explorar todas las herramientas</button>
					</div>
				</section>

				{/* TESTIMONIALS */}
				<section className="max-w-6xl mx-auto px-6 py-16">
					<h2 className="text-3xl font-bold text-center text-green-800 mb-8">Lo que dicen nuestros usuarios</h2>
					<div className="grid md:grid-cols-3 gap-6">
						<Testimonial quote="Gracias a AgroClima evitamos pérdidas en la última tormenta: alertas precisas y a tiempo." by="María López, agricultora" />
						<Testimonial quote="La información en tiempo real nos ayudó a programar riegos y ahorrar agua." by="Cooperativa Verde" />
						<Testimonial quote="Fácil de usar y con recomendaciones prácticas." by="Pedro García, ingeniero agro" />
					</div>
				</section>

				{/* FAQ */}
				<section className="max-w-6xl mx-auto px-6 py-16">
					<h2 className="text-3xl font-bold text-center text-green-800 mb-8">Preguntas frecuentes</h2>
					<div className="max-w-3xl mx-auto">
						<FaqItem i={1} q="¿Cómo conecto mi estación meteorológica?" a="Puedes conectar estaciones via API o integraciones soportadas; revisa la documentación para tu modelo." />
						<FaqItem i={2} q="¿Las alertas son personalizables?" a="Sí, puedes configurar umbrales por cultivo, región y tipo de evento." />
						<FaqItem i={3} q="¿Puedo exportar los datos?" a="Sí, exportamos en CSV y formatos compatibles con software agrícola." />
					</div>
				</section>

				{/* NEWSLETTER CTA */}
				<section className="bg-green-50 py-12">
					<div className="max-w-4xl mx-auto px-6 text-center">
						<h3 className="text-2xl font-bold text-green-800">Recibe alertas y novedades</h3>
						<p className="text-sm text-gray-600 mt-2">Suscríbete para recibir notificaciones y recursos para tu explotación.</p>
						<form onSubmit={(e) => { e.preventDefault(); alert('Subscripción simulada'); }} className="mt-4 flex max-w-md mx-auto">
							<input type="email" placeholder="tu@correo.com" required className="flex-1 rounded-l-md border border-gray-200 px-3 py-2" />
							<button className="px-4 py-2 bg-green-700 text-white rounded-r-md">Suscribirme</button>
						</form>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default HomePage;