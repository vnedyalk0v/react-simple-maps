import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCoords,
  fetchGeographies,
  getFeatures,
  getMesh,
  prepareFeatures,
  prepareMesh,
  createConnectorPath,
  isString,
} from '../src/utils';

describe('Utils', () => {
  describe('getCoords', () => {
    it('should calculate coordinates correctly', () => {
      const transform = { k: 2, x: 10, y: 20 } as any;
      const result = getCoords(800, 600, transform);

      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('number');
      expect(typeof result[1]).toBe('number');
    });

    it('should handle edge cases', () => {
      const transform = { k: 1, x: 0, y: 0 } as any;
      const result = getCoords(0, 0, transform);

      expect(result).toEqual([0, 0]);
    });
  });

  describe('fetchGeographies', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should fetch geography data successfully', async () => {
      const mockData = { type: 'Topology', objects: {} };
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        }),
      ) as any;

      const result = await fetchGeographies('test-url');
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('test-url');
    });

    it('should handle fetch errors', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          statusText: 'Not Found',
        }),
      ) as any;

      const result = await fetchGeographies('invalid-url');
      expect(result).toBeUndefined();
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('Network error')),
      ) as any;

      const result = await fetchGeographies('network-error-url');
      expect(result).toBeUndefined();
    });
  });

  describe('getFeatures', () => {
    it('should extract features from FeatureCollection', () => {
      const featureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: {},
          },
        ],
      };

      const result = getFeatures(featureCollection);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Feature');
    });

    it('should return empty array for topology with no objects', () => {
      const topology = {
        type: 'Topology' as const,
        arcs: [],
        objects: {},
      };

      const result = getFeatures(topology as any);
      expect(result).toEqual([]);
    });

    it('should return empty array for topology with null geometry object', () => {
      const topology = {
        type: 'Topology' as const,
        arcs: [],
        objects: {
          countries: null,
        },
      };

      const result = getFeatures(topology as any);
      expect(result).toEqual([]);
    });

    it('should handle array of features', () => {
      const features = [
        {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [0, 0] },
          properties: {},
        },
      ];

      const result = getFeatures(features as any);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Feature');
    });

    it('should extract features from Topology', () => {
      const topology = {
        type: 'Topology' as const,
        arcs: [],
        objects: {
          countries: {
            type: 'GeometryCollection' as const,
            geometries: [],
          },
        },
      };

      const result = getFeatures(topology as any);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should apply parseGeographies function', () => {
      const features = [
        {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [0, 0] },
          properties: {},
        },
      ];
      const parseGeographies = vi.fn((feats) => feats.slice(0, 0));

      const result = getFeatures(features as any, parseGeographies);
      expect(parseGeographies).toHaveBeenCalledWith(features);
      expect(result).toHaveLength(0);
    });
  });

  describe('createConnectorPath', () => {
    it('should create SVG path string', () => {
      const path = createConnectorPath(30, 30, 0.5);
      expect(typeof path).toBe('string');
      expect(path).toMatch(/^M/);
      expect(path).toContain('Q');
    });

    it('should handle different curve values', () => {
      const path1 = createConnectorPath(30, 30, 0);
      const path2 = createConnectorPath(30, 30, 1);

      expect(path1).not.toBe(path2);
    });

    it('should handle array curve values', () => {
      const path = createConnectorPath(30, 30, [0.3, 0.7]);
      expect(typeof path).toBe('string');
      expect(path).toMatch(/^M/);
    });
  });

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe('prepareFeatures', () => {
    it('should add svgPath to features', () => {
      const features = [
        {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [0, 0] },
          properties: {},
        },
      ];
      const mockPath = vi.fn(() => 'M0,0L10,10') as any;

      const result = prepareFeatures(features as any, mockPath);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('svgPath');
      expect(result[0]).toHaveProperty('rsmKey');
    });

    it('should handle undefined features', () => {
      const mockPath = vi.fn() as any;
      const result = prepareFeatures(undefined, mockPath);
      expect(result).toEqual([]);
    });
  });

  describe('prepareMesh', () => {
    it('should prepare mesh with svgPath', () => {
      const outline = { type: 'MultiLineString' as const, coordinates: [] };
      const borders = { type: 'MultiLineString' as const, coordinates: [] };
      const mockPath = vi.fn(() => 'M0,0L10,10') as any;

      const result = prepareMesh(outline, borders, mockPath);
      expect(result).toHaveProperty('outline');
      expect(result).toHaveProperty('borders');
      expect(result.outline).toBe('M0,0L10,10');
      expect(result.borders).toBe('M0,0L10,10');
    });

    it('should handle null mesh data', () => {
      const mockPath = vi.fn() as any;
      const result = prepareMesh(null, null, mockPath);
      expect(result).toEqual({});
    });
  });

  describe('getMesh', () => {
    it('should return null for topology with no objects', () => {
      const topology = {
        type: 'Topology' as const,
        arcs: [],
        objects: {},
      };

      const result = getMesh(topology as any);
      expect(result).toBeNull();
    });

    it('should return null for topology with null geometry object', () => {
      const topology = {
        type: 'Topology' as const,
        arcs: [],
        objects: {
          countries: null,
        },
      };

      const result = getMesh(topology as any);
      expect(result).toBeNull();
    });

    it('should extract mesh from valid topology', () => {
      const topology = {
        type: 'Topology' as const,
        arcs: [],
        objects: {
          countries: {
            type: 'GeometryCollection' as const,
            geometries: [],
          },
        },
      };

      const result = getMesh(topology as any);
      expect(result).toBeDefined();
    });
  });
});
