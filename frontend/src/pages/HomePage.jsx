import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicHeroSlidesApi } from "../features/homepage/api/homeApi"
import { getPublicHomeSectionsApi } from "../features/admin/api/adminApi";
import { getProductsApi, getPublicCollectionsApi } from "../features/products/api/productsApi";
import HeroCarousel from "../features/homepage/components/HeroCarousel";
import ProductCard from "../features/products/components/ProductCard";
import HomePageSkeleton from "../components/HomePageSkeleton";

export default function HomePage() {
  const [slides, setSlides] = useState([]);
  const [collections, setCollections] = useState([]);
  const [dynamicSections, setDynamicSections] = useState([]); // Array of { sectionData, products }
  const [sectionScrollPositions, setSectionScrollPositions] = useState({}); // Track scroll position per section
  const [transitioningSections, setTransitioningSections] = useState({}); // Track which sections are transitioning
  const [collectionPosition, setCollectionPosition] = useState(0);
  const [visibleCollectionCount, setVisibleCollectionCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // 1. Fetch foundational data
        const [slidesRes, collectionsRes, sectionsRes] = await Promise.all([
          getPublicHeroSlidesApi({ limit: 10 }),
          getPublicCollectionsApi({ limit: 10 }),
          getPublicHomeSectionsApi({ limit: 10 })
        ]);
        
        setSlides(slidesRes.data.slides || slidesRes.data);
        setCollections(collectionsRes.data.collections || collectionsRes.data);

        // 2. Fetch products for EACH dynamic section dynamically!
        const sectionsData = sectionsRes.data.sections || sectionsRes.data;
        const populatedSections = await Promise.all(
          sectionsData.map(async (sec) => {
            let params = { limit: 12 }; // Fetch 12 items to allow carousel navigation
            
            // Map the section criteria to our robust product sorting API
            if (sec.criteria === 'newest') params.sort = 'createdAt';
            if (sec.criteria === 'bestselling') params.sort = 'bestselling';
            if (sec.criteria === 'featured') params.sort = 'featured';
            if (sec.criteria === 'collection' && sec.collectionRef) params.collection = sec.collectionRef._id || sec.collectionRef;

            const pRes = await getProductsApi(params);
            return { ...sec, products: pRes.data.products || pRes.data };
          })
        );
        
        setDynamicSections(populatedSections);
        // Initialize scroll positions
        const initialPositions = {};
        populatedSections.forEach(section => {
          initialPositions[section._id] = 0;
        });
        setSectionScrollPositions(initialPositions);
      } catch (error) {
        console.error("Failed to load homepage data");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    const updateCollectionLayout = () => {
      const nextVisibleCount = window.innerWidth < 768 ? 2 : 3;
      setVisibleCollectionCount(nextVisibleCount);
      setCollectionPosition((position) =>
        Math.min(position, Math.max(0, collections.length - nextVisibleCount)),
      );
    };

    updateCollectionLayout();
    window.addEventListener("resize", updateCollectionLayout);
    return () => window.removeEventListener("resize", updateCollectionLayout);
  }, [collections.length]);

  const handleScroll = (sectionId, direction, productsLength) => {
    // Start transition (fade out)
    setTransitioningSections(prev => ({ ...prev, [sectionId]: true }));
    
    // After fade out, update position and fade back in
    setTimeout(() => {
      setSectionScrollPositions(prev => {
        const currentPosition = prev[sectionId] || 0;
        let newPosition = currentPosition;
        
        if (direction === 'next') {
          newPosition = Math.min(currentPosition + 4, Math.max(0, productsLength - 4));
        } else {
          newPosition = Math.max(currentPosition - 4, 0);
        }
        
        return { ...prev, [sectionId]: newPosition };
      });
      
      // End transition (fade in)
      setTransitioningSections(prev => ({ ...prev, [sectionId]: false }));
    }, 300);
  };

  const collectionMaxPosition = Math.max(0, collections.length - visibleCollectionCount);
  const visibleCollections = collections.slice(
    collectionPosition,
    collectionPosition + visibleCollectionCount + 1,
  );

  const collectionSection = collections.length > 0 && (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-2 md:pt-8">
      <div className="mb-5 flex items-center justify-between gap-3 md:mb-8">
        <h2 className="text-2xl font-serif font-bold md:text-3xl">Shop by Collection</h2>
      </div>
      <div className="relative">
        <div className="flex gap-4 overflow-hidden md:gap-6">
        {visibleCollections.map(col => (
          <div key={col._id} className="group relative h-64 min-w-[calc(50%-0.5rem)] overflow-hidden rounded-xl bg-neutral-900 shadow-md transition-transform duration-300 hover:-translate-y-1 md:h-80 md:min-w-[calc(33.333%-1rem)] md:flex-1">
            {col.image?.url && (
              <img src={col.image.url} alt={col.name} className="absolute inset-0 w-full h-full object-cover opacity-60 transition duration-700 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              <h3 className="text-2xl font-serif text-white font-bold mb-3 md:text-3xl md:mb-4">{col.name}</h3>
              <Link to={`/collections/${col.slug}`} className="bg-white text-neutral-900 px-5 py-2 text-sm rounded-sm font-semibold transition hover:bg-neutral-200 md:px-6">
                See More
              </Link>
            </div>
          </div>
        ))}
        </div>
        <button
          type="button"
          onClick={() => setCollectionPosition((position) => Math.max(0, position - 1))}
          disabled={collectionPosition === 0}
          aria-label="Previous collection"
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-400"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setCollectionPosition((position) => Math.min(collectionMaxPosition, position + 1))}
          disabled={collectionPosition >= collectionMaxPosition}
          aria-label="Next collection"
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-400"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
  const collectionInsertIndex = Math.ceil(dynamicSections.length / 2);

  if (loading) return <HomePageSkeleton />;

  return (
    <div className="space-y-8 pb-16 md:space-y-10">
      <div className="-mx-6 md:mx-0">
        <HeroCarousel slides={slides} />
      </div>

      {/* Render Dynamic Sections created by Admin */}
      {dynamicSections.map((section, sectionIndex) => {
        const currentPosition = sectionScrollPositions[section._id] || 0;
        const visibleProducts = section.products.slice(currentPosition, currentPosition + 4);
        const canScrollPrev = currentPosition > 0;
        const canScrollNext = currentPosition + 4 < section.products.length;
        const viewMorePath = section.criteria === 'collection' && section.collectionRef
          ? `/collections/${section.collectionRef.slug}`
          : `/products?sort=${section.criteria === 'featured' ? 'featured' : section.criteria === 'bestselling' ? 'bestselling' : 'createdAt'}`;

        return (
        <Fragment key={section._id}>
        <div key={section._id} className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 rounded-2xl border border-neutral-200 bg-neutral-100/80 shadow-sm md:bg-gray-200 md:shadow-none md:border-0">
          <div className="mb-6 flex flex-col items-start gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="w-full text-left">
              <h2 className="text-2xl font-serif font-bold mb-1 md:text-3xl">{section.title}</h2>
              {section.subtitle && <p className="text-sm text-neutral-600 max-w-xl md:text-base">{section.subtitle}</p>}
            </div>
            <Link
              to={viewMorePath}
              className="inline-flex h-fit shrink-0 items-center justify-center self-end border-2 border-neutral-900 px-5 py-2 text-sm font-medium text-neutral-900 transition duration-200 hover:bg-neutral-900 hover:text-white md:self-auto md:px-8 md:text-base"
            >
              View More
            </Link>
          </div>
          
          <div className="relative group">
            <div className={`grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6 transition-all duration-300 ease-in-out ${
              transitioningSections[section._id] ? 'opacity-0' : 'opacity-100'
            }`}>
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product, idx) => (
                  <div 
                    key={product._id} 
                    className="transition-all duration-500 ease-out hover:-translate-y-1 animate-fadeIn"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-neutral-500 py-4">Coming soon...</p>
              )}
            </div>

            {/* Chevron Navigation Buttons */}
            {section.products.length > 4 && (
              <>
                {/* Left Chevron */}
                <button
                  onClick={() => handleScroll(section._id, 'prev', section.products.length)}
                  disabled={!canScrollPrev}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-12 z-10 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-300 ${
                    canScrollPrev
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-110 hover:shadow-2xl hover:-translate-x-7 md:hover:-translate-x-14 cursor-pointer shadow-lg'
                      : 'bg-neutral-300 text-neutral-400 cursor-not-allowed opacity-40'
                  }`}
                  aria-label="Previous products"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                {/* Right Chevron */}
                <button
                  onClick={() => handleScroll(section._id, 'next', section.products.length)}
                  disabled={!canScrollNext}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-12 z-10 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-300 ${
                    canScrollNext
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-110 hover:shadow-2xl hover:translate-x-7 md:hover:translate-x-14 cursor-pointer shadow-lg'
                      : 'bg-neutral-300 text-neutral-400 cursor-not-allowed opacity-40'
                  }`}
                  aria-label="Next products"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        {sectionIndex + 1 === collectionInsertIndex && collectionSection}
        </Fragment>
        );
      })}

      {dynamicSections.length === 0 && collectionSection}
    </div>
  );
}