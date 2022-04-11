import random

from urllib3 import Retry

def random_ints():
    ls = []
    x = random.randint(1,6)
    while True:
        ls += [x]
        if x == 6:
            break
        else:
            x = random.randint(1,10)
    return ls
    # Your code here!


def test():
    N = 10000
    total_length = 0
    for i in range(N):
        l = random_ints()
        assert not 0 in l
        assert not 11 in l
        assert l[-1] == 6
        total_length += len(l)
    assert abs(total_length / N - 10) < 1 # checks that the length of the random strings are reasonable.
    print("Success!")

if __name__ == "__main__":
    test()
