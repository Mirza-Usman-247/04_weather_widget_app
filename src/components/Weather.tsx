"use client";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Weather = () => {
  interface weatherData {
    location: string;
    temperature: number;
    description: string;
    unit: string;
  }

  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<weatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleWeatherSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Invalid Location! put valid Location");
      setWeather(null);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error?.message || "Error while fetching API");
        setWeather(null);
        return;
      }
      const data = await res.json();
      const weatherdata: weatherData = {
        location: data.location.name,
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        unit: "C",
      };
      setWeather(weatherdata);
    } catch (error) {
      console.error("error while fetching data", error);
      setError("City not fount, plz try again");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };
  function TemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C! Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
      } else {
        return `It's hot at ${temperature}°C. Stay hydrated!`;
      }
    } else {
      return `${temperature}°${unit}`;
    }
  }
  function WeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
    }
  }
  function LocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;

    return ` ${location} ${isNight ? "at Night" : "During the Day"}`;
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Weather Widget</CardTitle>
          <CardDescription>
            Search for the current weather conditions in your city.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleWeatherSearch}
            className="flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Search"}{" "}
            </Button>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {weather && (
            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  {TemperatureMessage(weather.temperature, weather.unit)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 " />
                <div>{WeatherMessage(weather.description)}</div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 " />
                <div>{LocationMessage(weather.location)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Weather;
