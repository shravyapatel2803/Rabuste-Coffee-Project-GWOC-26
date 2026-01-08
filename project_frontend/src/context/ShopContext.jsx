import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserItems } from '../api/item.api';    
import { fetchPublicArts } from '../api/art.api';    
import { getAllWorkshops } from '../api/workshop.api'; 

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [arts, setArts] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [featuredItem, setFeaturedItem] = useState(null);
  
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  useEffect(() => {
    const loadGlobalData = async () => {
      try {
        const [itemsRes, artsRes, workshopsRes] = await Promise.allSettled([
            getUserItems({ showIn: "menu" }), // Fetch Menu Items
            fetchPublicArts(),                // Fetch Arts
            getAllWorkshops()                 // Fetch Workshops
        ]);

        if (itemsRes.status === 'fulfilled' && itemsRes.value.data) {
            const rawItems = itemsRes.value.data.items || []; 
            setMenuItems(rawItems);

            // Find Featured Item for Home Page
            const feat = rawItems.find(i => i.isFeatured === true);
            if (feat) setFeaturedItem(feat);
        }

        // Set Arts
        if (artsRes.status === 'fulfilled' && artsRes.value.data) {
            const rawArts = Array.isArray(artsRes.value.data) ? artsRes.value.data : artsRes.value.data.data || [];
            setArts(rawArts);
        }

        // Set Workshops
        if (workshopsRes.status === 'fulfilled' && workshopsRes.value.data) {
             const rawWorkshops = Array.isArray(workshopsRes.value.data) ? workshopsRes.value.data : workshopsRes.value.data.data || [];
             setWorkshops(rawWorkshops);
        }

      } catch (error) {
        console.error("Global Data Load Error:", error);
      } finally {
        setIsGlobalLoading(false);
      }
    };

    loadGlobalData();
  }, []); 

  return (
    <ShopContext.Provider value={{ 
        menuItems, 
        arts, 
        workshops, 
        featuredItem, 
        isGlobalLoading 
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);