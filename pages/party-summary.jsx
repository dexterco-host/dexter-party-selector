import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

const suggestedStates = ['Missouri', 'Arkansas', 'Texas', 'California', 'New York'];
const suggestedVibes = ['Social & Lighthearted', 'Chill & Introspective', 'Creative & Energized', 'Luxury Dinner Party', 'Laid-Back Lounge'];

export default function PartySummary() {
  const router = useRouter();
  const {
    name = '',
    email = '',
    state = suggestedStates[0],
    homeZip = '',
    eventZip = '',
    guests = '',
    vibe = suggestedVibes[0],
    description = ''
  } = router.query;

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (name && vibe && guests && state) {
      const fetchPlan = async () => {
        try {
          const response = await axios.post('/api/party-generator', {
            name,
            email,
            guests,
            state,
            homeZip,
            eventZip,
            vibe,
            description
          });
          setPlan(response.data);
        } catch (err) {
          console.error(err);
          setError('Failed to load party plan.');
        } finally {
          setLoading(false);
        }
      };
      fetchPlan();
    }
  }, [name, email, guests, state, homeZip, eventZip, vibe, description]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold">Your Custom Party Plan</h2>
          <p><strong>Host:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>State:</strong> {state}</p>
          <p><strong>Event Zip Code:</strong> {eventZip}</p>
          <p><strong>Home Zip Code:</strong> {homeZip}</p>
          <p><strong>Guest Count:</strong> {guests}</p>
          <p><strong>Party Vibe:</strong> {vibe}</p>

          {loading && <p>Loading your curated plan...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {plan && (
            <div className="mt-6 space-y-2">
              <h3 className="text-xl font-semibold">{plan.partyName}</h3>
              <p className="italic">{plan.description}</p>
              <p><strong>Cannabis Strain:</strong> {plan.strain}</p>
              <p><strong>Effect Profile:</strong> {plan.effect}</p>
              <p><strong>Why It Works:</strong> {plan.strainReason}</p>
              <p><strong>Gummy Pairing:</strong> {plan.gummy}</p>
              <p><strong>Serving Style:</strong> {plan.servingStyle}</p>
              <p><strong>Food:</strong> {plan.food}</p>
              <p><strong>Wine Pairings:</strong> {plan.winePairings}</p>
              <p><strong>Cocktails:</strong> {plan.cocktails}</p>
              <p><strong>Non-Alcoholic Options:</strong> {plan.nonAlcoholicDrinks}</p>
              <p><strong>Music Vibe:</strong> {plan.music}</p>
              <p><strong>Scent Suggestions:</strong> {plan.scent}</p>
              <p><strong>Lighting:</strong> {plan.lighting}</p>
              <p><strong>Dexter Products:</strong> {plan.recommendedProducts?.join(', ')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
