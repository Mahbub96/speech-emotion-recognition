def say_hello(name):
    return f"Hello, {name}!"

if __name__ == "__main__":
    import sys
    name = sys.argv[1]
    result = say_hello(name)
    print(result)
