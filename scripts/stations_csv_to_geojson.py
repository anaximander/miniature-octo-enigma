#! /usr/bin/env python3
# Converts bluebike station data from csv file into a geojson file of points
import csv
from datetime import datetime
import json
import re

import click


def js_key(key):
    return key[0].lower() + key.title().replace(' ', '')[1:]

def parse_date(last_updated_line):
    date_string = re.sub(r'(.*) (\d), (.*)', r'\1 0\2, \3', last_updated_line[1])
    last_updated_date = datetime.strptime(date_string, "%B %d, %Y")
    return last_updated_date


@click.command()
@click.option("-e", "--allow_empty", default=False, help="Allow rows with missing/empty values")
@click.option("-v", "--verbose", default=False, help="Show more information about the conversion attempt")
@click.argument("source")
@click.argument("output")
def convert(verbose, allow_empty, source, output):
    """Converts bluebike station data from CSV file into a GeoJSON file of points"""
    rows_read = 0
    features = []
    error_rows = []
    with open(source) as station_csv:
        reader = csv.reader(station_csv, delimiter=',', quotechar='"')
        last_updated_date = parse_date(next(reader))
        if verbose:
            click.echo(f"Last updated date: {last_updated_date}")
        # last_updated = # TODO: Parse from last_updated_line
        reader = csv.DictReader(station_csv, delimiter=',', quotechar='"')
        for row in reader:
            rows_read += 1
            if not allow_empty:
                for value in row.values():
                    skipped = False
                    if value is None or value == "":
                        if verbose:
                            click.echo("Skipping row with empty value")
                        skipped = True
                        error_rows.append(row)
                        break
                if skipped:
                    continue
            feature = {
                "type": "Feature",
                "properties": dict((js_key(k), v) for k,v in row.items()),
                "geometry": {
                    "coordinates": [float(row['Longitude']), float(row['Latitude'])],
                    "type": "Point"
                }
            }
            features.append(feature)
    geojson = {
        "features": features,
        "type": "FeatureCollection"
    }
    with open(output, "w") as geojson_file:
        json.dump(geojson, geojson_file, indent=2)
    click.echo(f"Successfully parsed {len(features)}/{rows_read} stations from {source} and wrote resulting GeoJSON to {output}")
    click.echo(f"Skipped {len(error_rows)} stations due to empty or missing values.")

if __name__ == '__main__':
    convert()
