export default function LocationHeader() {

  return (
    <header className={`flex flex-col items-center pt-20`}>
      <h1 className="font-serif tracking-tighter text-4xl sm:text-5xl mb-2 text-center">
        India&apos;s Best Wedding Photographers
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg mb-4 text-center max-w-xl">
        Discover and book top-rated photographers in your city for your special day.
      </p>
    </header>
  );
}