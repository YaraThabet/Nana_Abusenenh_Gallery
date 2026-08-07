const HeroSection = () => {
  return (
    <div
      className="
        w-full 
        h-screen 
        bg-cover 
        bg-center
        sm:bg-center
      "
      style={{ backgroundImage: `url('/hero-img.png')` }}
    ></div>
  );
};

export default HeroSection;