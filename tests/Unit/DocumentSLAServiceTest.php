<?php

namespace Tests\Unit;

use App\Services\DocumentSLAService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class DocumentSLAServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_calculate_returns_nulls_when_no_config()
    {
        $service = new DocumentSLAService();
        $result = $service->calculate(null, null, Carbon::now());
        $this->assertArrayHasKey('response_at', $result);
        $this->assertArrayHasKey('resolution_at', $result);
        $this->assertNull($result['response_at']);
        $this->assertNull($result['resolution_at']);
    }
}
