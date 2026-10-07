import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
      <footer className="mt-16 border-t border-leaf-800/10 bg-leaf-900 text-wheat-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl">AgriConnect</p>
          <p className="text-sm text-wheat-200/80">
            Connecting farmers and buyers — farm-direct marketplace.
          </p>
        </div>
      </footer>
    </div>
  );
}
