#!/usr/bin/env python3
"""
Fetch TVL and protocol data from DeFiLlama API.

This script retrieves historical TVL data for protocols tracked by DeFiLlama,
analyzes key metrics, and optionally saves the raw data to a JSON file.

Usage:
    uv run reports/scripts/fetch_defillama_tvl.py origin-arm
    uv run reports/scripts/fetch_defillama_tvl.py origin-arm --save-json
    uv run reports/scripts/fetch_defillama_tvl.py origin-arm --days 30
"""

import argparse
import json
import sys
from datetime import datetime
from typing import Dict, List, Optional, Tuple

import requests


def fetch_protocol_data(protocol_slug: str) -> Dict:
    """
    Fetch protocol data from DeFiLlama API.

    Args:
        protocol_slug: The protocol identifier (e.g., 'origin-arm', 'aave', 'uniswap')

    Returns:
        Dictionary containing protocol data

    Raises:
        requests.exceptions.RequestException: If API request fails
    """
    url = f"https://api.llama.fi/protocol/{protocol_slug}"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for protocol '{protocol_slug}': {e}", file=sys.stderr)
        raise


def analyze_tvl_data(tvl_data: List[Dict]) -> Dict:
    """
    Analyze TVL historical data and extract key metrics.

    Args:
        tvl_data: List of TVL data points with 'date' and 'totalLiquidityUSD' fields

    Returns:
        Dictionary containing analysis results:
        - current_tvl: Current TVL in USD
        - current_date: Date of current TVL
        - peak_tvl: Maximum TVL in USD
        - peak_date: Date of peak TVL
        - min_tvl: Minimum TVL in USD
        - min_date: Date of minimum TVL
        - launch_tvl: Initial TVL in USD
        - launch_date: Launch date
        - data_points: Number of data points
    """
    if not tvl_data:
        return {}

    # Find peak and minimum
    peak_entry = max(tvl_data, key=lambda x: x.get("totalLiquidityUSD", 0))
    min_entry = min(tvl_data, key=lambda x: x.get("totalLiquidityUSD", 0))

    # Current and launch
    latest = tvl_data[-1]
    first = tvl_data[0]

    return {
        "current_tvl": latest.get("totalLiquidityUSD", 0),
        "current_date": datetime.fromtimestamp(latest.get("date", 0)).strftime("%Y-%m-%d"),
        "peak_tvl": peak_entry.get("totalLiquidityUSD", 0),
        "peak_date": datetime.fromtimestamp(peak_entry.get("date", 0)).strftime("%Y-%m-%d"),
        "min_tvl": min_entry.get("totalLiquidityUSD", 0),
        "min_date": datetime.fromtimestamp(min_entry.get("date", 0)).strftime("%Y-%m-%d"),
        "launch_tvl": first.get("totalLiquidityUSD", 0),
        "launch_date": datetime.fromtimestamp(first.get("date", 0)).strftime("%Y-%m-%d"),
        "data_points": len(tvl_data),
    }


def print_protocol_summary(data: Dict, analysis: Dict) -> None:
    """
    Print formatted protocol summary.

    Args:
        data: Raw protocol data from API
        analysis: Analysis results from analyze_tvl_data()
    """
    print("=" * 60)
    print(f"Protocol: {data.get('name', 'Unknown')}")
    print(f"Symbol: {data.get('symbol', 'N/A')}")
    print(f"Chain: {data.get('chain', 'Unknown')}")
    print(f"Category: {data.get('category', 'Unknown')}")
    print(f"URL: {data.get('url', 'N/A')}")
    print("=" * 60)
    print()

    if analysis:
        print("TVL Analysis:")
        print(f"  Current TVL:  ${analysis['current_tvl']:,.2f} ({analysis['current_date']})")
        print(f"  Peak TVL:     ${analysis['peak_tvl']:,.2f} ({analysis['peak_date']})")
        print(f"  Minimum TVL:  ${analysis['min_tvl']:,.2f} ({analysis['min_date']})")
        print(f"  Launch TVL:   ${analysis['launch_tvl']:,.2f} ({analysis['launch_date']})")
        print(f"  Data Points:  {analysis['data_points']}")

        # Calculate volatility metrics
        if analysis['min_tvl'] > 0:
            volatility_ratio = analysis['peak_tvl'] / analysis['min_tvl']
            print(f"  Volatility:   {volatility_ratio:.1f}x (peak/min ratio)")
        print()


def print_recent_history(tvl_data: List[Dict], days: int = 10) -> None:
    """
    Print recent TVL history.

    Args:
        tvl_data: List of TVL data points
        days: Number of recent days to display
    """
    if not tvl_data:
        return

    print(f"Recent TVL History (last {days} days):")
    recent_data = tvl_data[-days:]

    for entry in recent_data:
        date = datetime.fromtimestamp(entry["date"]).strftime("%Y-%m-%d")
        tvl = entry.get("totalLiquidityUSD", 0)
        print(f"  {date}: ${tvl:,.2f}")
    print()


def save_to_json(data: Dict, filename: str) -> None:
    """
    Save protocol data to JSON file.

    Args:
        data: Protocol data to save
        filename: Output filename
    """
    try:
        with open(filename, "w") as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to: {filename}")
    except IOError as e:
        print(f"Error saving to file: {e}", file=sys.stderr)


def main() -> None:
    """Main function to fetch and display DeFiLlama protocol data."""
    parser = argparse.ArgumentParser(
        description="Fetch TVL and protocol data from DeFiLlama API"
    )
    parser.add_argument(
        "protocol",
        type=str,
        help="Protocol slug (e.g., 'origin-arm', 'aave', 'uniswap')",
    )
    parser.add_argument(
        "--days",
        type=int,
        default=10,
        help="Number of recent days to display (default: 10)",
    )
    parser.add_argument(
        "--save-json",
        action="store_true",
        help="Save raw data to JSON file",
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Output filename for JSON (default: <protocol>_defillama.json)",
    )

    args = parser.parse_args()

    try:
        # Fetch data
        print(f"Fetching data for protocol: {args.protocol}...")
        data = fetch_protocol_data(args.protocol)

        # Analyze TVL data
        tvl_data = data.get("tvl", [])
        analysis = analyze_tvl_data(tvl_data)

        # Print summary
        print_protocol_summary(data, analysis)

        # Print recent history
        if tvl_data:
            print_recent_history(tvl_data, args.days)

        # Save to JSON if requested
        if args.save_json:
            output_file = args.output or f"{args.protocol}_defillama.json"
            save_to_json(data, output_file)

    except requests.exceptions.RequestException:
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
