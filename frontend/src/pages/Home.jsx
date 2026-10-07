import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(20,53,40,0.88) 0%, rgba(20,53,40,0.55) 45%, rgba(20,53,40,0.25) 100%), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3036?w=1600&q=80')",
        }}
      />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-4 py-16 text-wheat-100">
        <p className="animate-fade-up font-display text-5xl font-bold tracking-tight sm:text-7xl">
          AgriConnect
        </p>
        <h1 className="animate-fade-up-delay mt-4 max-w-xl font-display text-2xl font-medium text-wheat-200 sm:text-3xl">
          Farm-fresh produce, direct from growers to your door.
        </h1>
        <p className="animate-fade-up-delay mt-4 max-w-md text-wheat-200/90">
          Browse local harvests, support farmers, and manage your farm inventory in one place.
        </p>
        <div className="animate-fade-up-delay mt-8 flex flex-wrap gap-3">
          <Link to="/shop" className="btn-primary bg-amber-field hover:bg-[#a86824]">
            Browse marketplace
          </Link>
          <Link
            to="/register"
            className="btn-secondary border-wheat-200 text-wheat-100 hover:bg-white/10"
          >
            Sell as a farmer
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 hidden h-24 w-24 rounded-full border border-wheat-200/30 animate-float md:block" />
    </section>
  );
}
