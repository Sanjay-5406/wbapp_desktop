import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import runpy
import os
import sys


script = sys.argv[1]

runpy.run_path(
    script,
    run_name="__main__"
)


for i, fig_num in enumerate(plt.get_fignums()):

    fig = plt.figure(fig_num)

    output = f"/app/figure_{i+1}.png"

    fig.savefig(output)

    print(
        f"Saved {output}"
    )