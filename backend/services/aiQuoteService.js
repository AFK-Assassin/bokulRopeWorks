import { GoogleGenAI } from '@google/genai';

/**
 * Calibrated rule-based estimation formula for Bengal Jute manufacturing
 */
function calculateFallbackEstimate({ productInterest, diameter, requiredQuantity, message }) {
  // Parse numeric quantity in KG if possible
  let qtyKg = null;
  const qtyMatch = (requiredQuantity || '').match(/(\d[\d,]*)/);
  if (qtyMatch) {
    qtyKg = parseFloat(qtyMatch[1].replace(/,/g, ''));
  }

  // Parse diameter in mm
  let diaMm = 16;
  const diaMatch = (diameter || message || '').match(/(\d+)\s*mm/i);
  if (diaMatch) {
    diaMm = parseInt(diaMatch[1], 10);
  }

  let minRate = 110;
  let maxRate = 135;
  let breakingLoad = '1,900 - 2,400 kgf';
  let plies = '3-Strand Hawser Laid';
  let leadTime = '4 - 7 Business Days';

  const productLower = (productInterest || '').toLowerCase();

  if (productLower.includes('manila')) {
    minRate = 220;
    maxRate = 280;
    breakingLoad = `${Math.round(diaMm * 180)} - ${Math.round(diaMm * 260)} kgf`;
    plies = '3-Strand / 4-Strand Grade-1 Abaca Manila';
    leadTime = '5 - 9 Business Days';
  } else if (productLower.includes('sisal')) {
    minRate = 180;
    maxRate = 230;
    breakingLoad = `${Math.round(diaMm * 140)} - ${Math.round(diaMm * 190)} kgf`;
    plies = '3-Ply High-Friction Sisal';
    leadTime = '4 - 7 Business Days';
  } else if (productLower.includes('yarn')) {
    minRate = 120;
    maxRate = 155;
    breakingLoad = 'High Tenacity Continuous Spin';
    plies = 'Single / 2-Ply Precision Spun (Count 4.8 - 36 lbs)';
    leadTime = '3 - 6 Business Days';
  } else if (productLower.includes('twine') || productLower.includes('packaging')) {
    minRate = 135;
    maxRate = 165;
    breakingLoad = '45 - 120 kgf';
    plies = '2-Ply / 3-Ply High Spun';
    leadTime = '3 - 5 Business Days';
  } else if (productLower.includes('baan')) {
    minRate = 95;
    maxRate = 125;
    breakingLoad = '80 - 450 kgf';
    plies = 'Traditional High-Twist Baan (2-Ply / 3-Ply)';
    leadTime = '3 - 5 Business Days';
  } else if (productLower.includes('line')) {
    minRate = 140;
    maxRate = 175;
    breakingLoad = '60 - 750 kgf (Calibrated Low-Stretch)';
    plies = '3-Ply / 4-Ply Precision Line';
    leadTime = '4 - 6 Business Days';
  } else if (productLower.includes('spunyarn')) {
    minRate = 160;
    maxRate = 210;
    breakingLoad = 'High Marine Grip & Seizing Strength';
    plies = '2 to 4-Ply Stockholm Tarred / Natural';
    leadTime = '4 - 7 Business Days';
  } else if (productLower.includes('carpet') || productLower.includes('rug') || productLower.includes('mat')) {
    minRate = 150;
    maxRate = 240;
    breakingLoad = 'Commercial Heavy Footfall Grade';
    plies = 'Woven / Braided Natural Jute';
    leadTime = '7 - 14 Business Days';
  } else if (productLower.includes('bag') || productLower.includes('sack') || productLower.includes('burlap')) {
    minRate = 110;
    maxRate = 145;
    breakingLoad = 'Tested for 100+ kg Drop Standard';
    plies = 'Heavy A-Twill / B-Twill Woven Sacking';
    leadTime = '5 - 10 Business Days';
  } else if (productLower.includes('4-ply') || productLower.includes('industrial') || diaMm >= 25) {
    minRate = 125;
    maxRate = 150;
    breakingLoad = `${Math.round(diaMm * 150)} - ${Math.round(diaMm * 210)} kgf`;
    plies = '4-Strand Shroud Laid';
    leadTime = '5 - 8 Business Days';
  } else if (productLower.includes('custom') || productLower.includes('oem')) {
    minRate = 130;
    maxRate = 160;
    breakingLoad = 'Calibrated to Tender';
    plies = 'Custom Laid as per Drawing';
    leadTime = '7 - 12 Business Days';
  } else {
    // Standard 3-ply
    breakingLoad = `${Math.max(450, Math.round(diaMm * 110))} - ${Math.round(diaMm * 160)} kgf`;
  }

  // Volume discount adjustment
  if (qtyKg && qtyKg >= 2000) {
    minRate -= 8;
    maxRate -= 8;
  } else if (qtyKg && qtyKg >= 5000) {
    minRate -= 15;
    maxRate -= 15;
  }

  let totalMin = null;
  let totalMax = null;
  if (qtyKg) {
    totalMin = Math.round(qtyKg * minRate);
    totalMax = Math.round(qtyKg * maxRate);
  }

  return {
    priceRangePerKg: `₹${minRate} – ₹${maxRate} / kg`,
    estimatedTotalRange: totalMin && totalMax 
      ? `₹${totalMin.toLocaleString('en-IN')} – ₹${totalMax.toLocaleString('en-IN')}` 
      : 'Calculated on final verified batch volume',
    currency: 'INR',
    estimatedQtyKg: qtyKg ? `${qtyKg} kg` : (requiredQuantity || 'Standard Mill Batch (500 kg MOQ)'),
    recommendedSpecs: {
      plies,
      recommendedDiameter: `${diaMm} mm`,
      estimatedBreakingLoad: breakingLoad,
      finish: 'Natural Golden Fiber / Tarred on specification',
      origin: 'Howrah, West Bengal'
    },
    leadTime,
    packagingAdvice: 'Heavy-duty breathable Hessian sacking wrapping with moisture-barrier core',
    advisorNotes: 'Price range is based on current raw fiber index. Final commercial invoice may vary slightly with freight distance and custom stenciling requirements.',
    isAiGenerated: false
  };
}

/**
 * Generate AI Quote with Gemini or Fallback
 */
export async function generateQuoteEstimate(inquiryData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return calculateFallbackEstimate(inquiryData);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are an expert technical quotation specialist for Bokul Rope Works, a premier natural fiber and cordage manufacturing plant in Howrah, West Bengal, India.
We manufacture and export:
1. Jute Ropes (3-Strand Hawser Laid & 4-Ply Industrial Cordage)
2. Pure Manila Ropes (Abaca Natural Fibre)
3. Industrial Sisal Ropes & Cordage
4. Precision-Spun Jute Yarn (Single & Multi-End, counts 4.8 - 36 lbs)
5. Eco-Friendly Jute Packaging Twines & Strings
6. Traditional Jute Baan Ropes (Charpai Cordage)
7. Precision Line Ropes (Masonry, Marine & Chalk Lines)
8. Marine & Industrial Spunyarn (Tarred & Natural)
9. Natural Jute Carpets, Rugs & Geotextile Mats
10. Burlap Jute Bags & Heavy Gunny Sacks (50kg, 100kg A-Twill & B-Twill)
11. Custom OEM & Tender Specifications

A B2B buyer has requested a quotation with the following details:
- Product Interest: ${inquiryData.productInterest || 'General Jute & Cordage'}
- Target Diameter/Gauge: ${inquiryData.diameter || 'Not specified'}
- Estimated Quantity: ${inquiryData.requiredQuantity || 'Commercial MOQ (500 kg)'}
- Delivery Location: ${inquiryData.deliveryLocation || 'Pan-India'}
- Buyer Application & Notes: ${inquiryData.message || 'Standard commercial use'}

Calculate and provide an industrial price range and technical recommendation strictly formatted as a valid JSON object matching this structure:
{
  "priceRangePerKg": "₹115 – ₹138 / kg",
  "estimatedTotalRange": "₹1,15,000 – ₹1,38,000" (or "Calculated on batch volume" if volume unclear),
  "currency": "INR",
  "estimatedQtyKg": "1000 kg",
  "recommendedSpecs": {
    "plies": "3-Strand Hawser Laid / 4-Strand",
    "recommendedDiameter": "16 mm",
    "estimatedBreakingLoad": "1,900 - 2,400 kgf",
    "finish": "Natural Bengal Jute",
    "origin": "Howrah, West Bengal"
  },
  "leadTime": "4 - 7 Business Days",
  "packagingAdvice": "Heavy-duty Hessian sacking coils with inner moisture barrier",
  "advisorNotes": "Brief 1-2 sentence engineering and commercial advice for this application."
}

Return ONLY the raw JSON object, without markdown quotes or backticks.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text ? response.text.trim() : '';
    const cleanJson = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanJson);
    parsed.isAiGenerated = true;
    return parsed;
  } catch (error) {
    console.warn('[AI Quote Warning] Gemini API call fallback triggered:', error.message);
    return calculateFallbackEstimate(inquiryData);
  }
}

export const generateInstantQuoteEstimate = generateQuoteEstimate;

