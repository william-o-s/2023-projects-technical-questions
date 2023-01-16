import request from "supertest";

type Location = { x: number; y: number };
type SpaceCowboy = { name: string; lassoLength: number };
type SpaceAnimal = { type: "pig" | "cow" | "flying_burger" };

type SpaceEntity =
  | { type: "space_cowboy"; metadata: SpaceCowboy; location: Location }
  | { type: "space_animal"; metadata: SpaceAnimal; location: Location };

describe("Part 1", () => {
  describe("POST /entity", () => {
    const createEntities = async (entities: SpaceEntity[]) => {
      return await request("http://localhost:8080")
        .post("/entity")
        .send({ entities });
    };

    it("creates new entities", async () => {
      const entities: SpaceEntity[] = [
        {
          type: "space_cowboy",
          metadata: { name: "Buckaroo Banzai", lassoLength: 10 },
          location: { x: 1, y: 2 },
        },
        {
          type: "space_animal",
          metadata: { type: "flying_burger" },
          location: { x: 3, y: 4 },
        },
      ];
      const response = await createEntities(entities);
      expect(response.status).toBe(200);
    });

    it("creates new entities with valid input", async () => {
      const entities: SpaceEntity[] = [
        {
          type: "space_animal",
          metadata: { type: "pig" },
          location: { x: -200, y: 4 },
        },
        {
          type: "space_cowboy",
          metadata: { name: "Buckaroo Banzai", lassoLength: 10 },
          location: { x: 100, y: 2 },
        },
      ];
      const response = await createEntities(entities);
      expect(response.status).toBe(200);
    });

    it("creates new entities with valid input", async () => {
      const entities: SpaceEntity[] = [
        {
          type: "space_animal",
          metadata: { type: "cow" },
          location: { x: 1, y: 2 },
        },
        {
          type: "space_animal",
          metadata: { type: "flying_burger" },
          location: { x: 3, y: 4 },
        },
      ];
      const response = await createEntities(entities);
      expect(response.status).toBe(200);
    });
    
    // Invalid Space Entities
    const cases: SpaceEntity[] = [
      {
        type: "space_human",
        metadata: { name: "Buckaroo Banzai", lassoLength: 10 },
        location: { x: 100, y: 2 },
      },
      {
        type: "space_cowboy",
        metadata: { name: "", lassoLength: 19 },
        location: { x: 1, y: 2 },
      },
      {
        type: "space_cowboy",
        metadata: { name: "Buckaroo Banzai", lassoLength: -10 },
        location: { x: 100, y: 2 },
      },
      {
        type: "space_animal",
        metadata: { type: "dog :(" },
        location: { x: 1, y: 2 },
      },
      {
        type: "space_animal",
        metadata: { type: "Rudolph the Red-Nosed Reindeer" },
        location: { x: 1, y: 2 },
      },
    ];
  
    test.each(cases)(
      "Fails when creating invalid Space Entity",
      async (spaceEntity) => {
        const response = await createEntities([spaceEntity]);
        expect(response.status).not.toBe(200);
      }
    );
  });
});

describe("Part 2", () => {
  const mockData: SpaceEntity[] = [
    // Can reach the pig and cow
    {
      type: "space_cowboy",
      metadata: { name: "Buckaroo Banzai", lassoLength: 3 },
      location: { x: 1, y: 2 },
    },
    // Can reach only the flying_burger
    {
      type: "space_cowboy",
      metadata: { name: "Eliot Ness", lassoLength: 2 },
      location: { x: 3, y: 4 },
    },
    {
      type: "space_animal",
      metadata: { type: "pig" },
      location: { x: 4, y: 2 },
    },
    {
      type: "space_animal",
      metadata: { type: "cow" },
      location: { x: 2, y: 2 },
    },
    {
      type: "space_animal",
      metadata: { type: "flying_burger" },
      location: { x: 3, y: 5 },
    },
  ];

  const getLassoable = async (name: string) => {
    return await request("http://localhost:8080")
      .get("/lassoable")
      .query({ cowboy_name: name });
  };

  beforeAll(async () => {
    await request("http://localhost:8080")
      .post("/entity")
      .send({ entities: mockData });
  });

  describe("GET /lassoable", () => {
    it("should calculate the right distances for Buckaroo Banzai", async () => {
      const expected = [
        {
          type: "pig",
          location: { x: 4, y: 2 },
        },
        {
          type: "cow",
          location: { x: 2, y: 2 },
        },
      ];

      const response = await getLassoable("Buckaroo Banzai");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        space_animals: expected,
      });
    });

    it("should calculate the right distances for Eliot Ness", async () => {
      const expected = [
        {
          type: "flying_burger",
          location: { x: 3, y: 5 },
        },
      ];

      const response = await getLassoable("Eliot Ness");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        space_animals: expected,
      });
    });

    it("should return nothing when cowboy is non-existent", async () => {
      const expected = [];

      const response = await getLassoable("My Future");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        space_animals: expected,
      });
    });

    it("should return nothing when given nothing", async () => {
      const expected = [];

      const response = await getLassoable("");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        space_animals: expected,
      });
    });
  });
});
