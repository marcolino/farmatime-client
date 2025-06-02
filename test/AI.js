// Install required packages:
// yarn add -D jest @testing-library/react @testing-library/user-event @testing-library/jest-dom msw jest-environment-jsdom

// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["@babel/preset-env", "@babel/preset-react"] }],
  },
};

// src/setupTests.js
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Establish API mocking before all tests
beforeAll(() => server.listen());
// Reset any request handlers between tests
afterEach(() => server.resetHandlers());
// Clean up after all tests
afterAll(() => server.close());

// __mocks__/fileMock.js
module.exports = "test-file-stub";

// src/mocks/server.js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// src/mocks/handlers.js
import { rest } from "msw";

export const handlers = [
  rest.get("/api/users", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" }
      ])
    );
  }),
];

// Example Component: src/components/UserList.jsx
import React, { useState, useEffect } from "react";
import { fetchUsers } from "../services/userService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>User List</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;

// Example Service: src/services/userService.js
export const fetchUsers = async () => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// Example Custom Hook: src/hooks/useLocalStorage.js
import { useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// UNIT TESTS

// Testing a Component: src/components/UserList.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import UserList from "./UserList";
import { fetchUsers } from "../services/userService";

// Mock the service
jest.mock("../services/userService");

describe("UserList Component", () => {
  test("displays loading state initially", () => {
    fetchUsers.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 1000)));
    render(<UserList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays users when loaded successfully", async () => {
    fetchUsers.mockResolvedValue([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" }
    ]);
    
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  test("displays error message when fetch fails", async () => {
    fetchUsers.mockRejectedValue(new Error("Failed to fetch"));
    
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText("Failed to load users")).toBeInTheDocument();
    });
  });
});

// Testing a Custom Hook: src/hooks/useLocalStorage.test.js
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage hook", () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();
    
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
  });

  test("should use initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  test("should update state and localStorage when setValue is called", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));
    
    act(() => {
      result.current[1]("updated");
    });
    
    expect(result.current[0]).toBe("updated");
    expect(window.localStorage.setItem).toHaveBeenCalledWith("key", JSON.stringify("updated"));
  });
});

// INTEGRATION TEST

// src/App.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// This test assumes your App component includes the UserList and some form of user interaction
describe("App Integration", () => {
  test("full user flow works correctly", async () => {
    // Setup user event
    const user = userEvent.setup();
    
    // Render the full app
    render(<App />);
    
    // Initial loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    
    // Wait for users to load (this works because we set up MSW to mock the API)
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
    
    // Test user interaction, assuming there is a button to filter users
    const filterButton = screen.getByRole("button", { name: /filter/i });
    await user.click(filterButton);
    
    // Check that filtering worked
    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });
});