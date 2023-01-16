/**
 * First thoughts:
 *  - Like COMP1531, this task involves creating routes for an Express server. Thanks Peter!
 *  - The POST route was befuddled me until I realised I had forgotten to use the express.json()
 *  middleware. Oops!
 *  - I would love to place this in another file, but am keeping it here for easier reading for the
 *  interviewers.
 *  - Added some failure tests into the Jest file, for invalid names, etc.
 * Closing thoughts:
 *  - Thanks for the challenge! It's a good exercise on Express and TS.
 */

import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our super amazing system
type Location = { x: number; y: number };
type SpaceCowboy = { name: string; lassoLength: number };
type SpaceAnimal = { type: 'pig' | 'cow' | 'flying_burger' };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type SpaceEntity =
  | { type: 'space_cowboy'; metadata: SpaceCowboy; location: Location }
  | { type: 'space_animal'; metadata: SpaceAnimal; location: Location };

// === ADD YOUR CODE BELOW :D ===

type EmptyObject = Record<string, never>;

interface LassoableAnimal extends SpaceAnimal {
  'location': Location
};

/** Global space entities database store */
const spaceDatabase = [] as SpaceEntity[];

/** Validates the given object as a SpaceCowboy. */
const isValidCowboy = (spaceCowboy: any): boolean => {
  return(
    spaceCowboy?.type === 'space_cowboy' &&
    spaceCowboy?.metadata?.name?.length > 0 &&
    spaceCowboy?.metadata?.lassoLength >= 0
  );
  }
  
  /** Validates the given object as a SpaceAnimal. */
const isValidAnimal = (spaceAnimal: any): boolean => {
  return(
    spaceAnimal?.type === 'space_animal' &&
    (
      spaceAnimal?.metadata?.type === 'pig' ||
      spaceAnimal?.metadata?.type === 'cow' ||
      spaceAnimal?.metadata?.type === 'flying_burger'
    )
  );
}

/** Adds Space Entities to the database. */
const addEntities = (spaceEntities: SpaceEntity[]): EmptyObject => {
  // Verify each space entity before pushing 
  for (const spaceEntity of spaceEntities) {
    // Guard for valid space entities
    if (!(isValidCowboy(spaceEntity) || isValidAnimal(spaceEntity))) {
      throw new Error('Space Entity not valid!');
    }

    // Add space entity to database
    spaceDatabase.push(spaceEntity);
  }

  return {};
}

/** Calculates the Pythagorean distance between a Space Cowboy and a Space Animal. */
const pythagoreanDistance = (
  cowboyX: number,
  cowboyY: number,
  animalX: number,
  animalY: number
): number => {
  return Math.sqrt(Math.pow(cowboyX - animalX, 2) + Math.pow(cowboyY - animalY, 2));
}

/** Returns a list of all lassoable Space Animals by the given Space Cowboy. */
const getLassoable = (cowboyName: string): { 'space_animals': LassoableAnimal[] } => {
  const space_animals = [] as LassoableAnimal[];

  // Grabs all cowboys, then finds a corresponding name
  const cowboyEntity = spaceDatabase
    .filter(entity => entity.type === 'space_cowboy')
    .find(cowboy => (cowboy.metadata as SpaceCowboy).name === cowboyName);
  
  if (cowboyEntity !== undefined) {
    const lassoLength = (cowboyEntity.metadata as SpaceCowboy).lassoLength;

    // Grabs all animals, then filters all lassoable animals, then maps to the right object type
    const lassoableAnimals = spaceDatabase
      .filter(entity => entity.type === 'space_animal')
      .filter(animal => {
        const cowboyAnimalDistance = pythagoreanDistance(
          cowboyEntity.location.x,
          cowboyEntity.location.y,
          animal.location.x,
          animal.location.y
        );

        // Comparison filters lassoable animals
        return cowboyAnimalDistance <= lassoLength;
      })
      .map(animal => ({
        type: (animal.metadata as SpaceAnimal).type,
        location: animal.location,
      }));
    
    space_animals.push(...lassoableAnimals);
  }

  return { space_animals };
}

// === ExpressJS setup + Server setup ===
const app = express();

// Middleware for JSON body: caused a lot of headache with finding body parameters!
app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res, next) => {
  try {
    // Assume request comes with body parameter `entities`.
    const spaceEntities = req.body?.entities as SpaceEntity[];

    // Handle adding of space entities
    return res.json(addEntities(spaceEntities));
  } catch (err) {
    next(err);
  }
});

// /lassoable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res, next) => {
  try {
    // Assume request comes with query parameter `cowboy_name`.
    const spaceCowboy = req.query?.cowboy_name as string;

    // Handle retrieval of lassoable space animals
    return res.json(getLassoable(spaceCowboy));
  } catch (err) {
    next(err);
  }
});

app.listen(8080);