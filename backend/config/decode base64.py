import base64

base64_string = "MTgxNS4xNzM4OE4wNjYzOS40MzY3NFc="

def base64_to_string_location(base64_string):
    base64_bytes = base64_string.encode("ascii")

    sample_string_bytes = base64.b64decode(base64_bytes)
    sample_string = sample_string_bytes.decode("ascii")

    index = max(sample_string.find("N"), sample_string.find("S"))

    latitude = sample_string[:index+1]
    longitude = sample_string[index+1:]

    latitude1 = latitude[:-1]
    lat_float = str(round(float(latitude1[latitude1.find(".")-2:])/60, 6))
    lat_float = lat_float[lat_float.find("."):]

    latitude1 = latitude1[:latitude1.find(".")-2] + lat_float[lat_float.find("."):]
    longitude1 = longitude[:-1]
    longitude_float = str(round(float(longitude1[longitude1.find(".")-2:])/60, 6))
    longitude_float = longitude_float[longitude_float.find("."):]

    longitude1 = longitude1[:longitude1.find(".")-2] + longitude_float[longitude_float.find("."):]
    if latitude[-1] == "N":
        latitude = latitude1
    elif latitude[-1] == "S":
        latitude = "-" + latitude

    if longitude1[0] == "0":
        longitude1 = longitude1[1:]

    if longitude[-1] == "E":
        longitude = longitude1
    elif longitude[-1] == "W":
        longitude = "-" + longitude1

    return latitude + ", " + longitude


location = base64_to_string_location(base64_string)
print("Location: ", location)
# print(f"Latitude: {latitude}")
# print(f"Longitude: {longitude}")
# print(f"Location: {location}")

# print(f"Decoded string: {sample_string}")